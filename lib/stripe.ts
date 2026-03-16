import Stripe from 'stripe'
import { prisma } from './prisma'
import { addEmailJob, addNotificationJob } from './queue'

const key = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Stripe typings pin apiVersion to the installed SDK's supported literal union.
// We omit it to use the SDK default for this version.
const stripe = key ? new Stripe(key) : null

function appUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export async function createConnectedAccount(userId: string, email: string): Promise<string> {
  if (!stripe) return appUrl('/dashboard/reviewer')

  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: { transfers: { requested: true } },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { stripeAccountId: account.id },
  })

  const link = await stripe.accountLinks.create({
    account: account.id,
    type: 'account_onboarding',
    refresh_url: appUrl('/dashboard/reviewer'),
    return_url: appUrl('/dashboard/reviewer'),
  })

  return link.url
}

export async function createAccountLink(stripeAccountId: string): Promise<string> {
  if (!stripe) return appUrl('/dashboard/reviewer')

  const link = await stripe.accountLinks.create({
    account: stripeAccountId,
    type: 'account_onboarding',
    refresh_url: appUrl('/dashboard/reviewer'),
    return_url: appUrl('/dashboard/reviewer'),
  })
  return link.url
}

export async function createTip(params: {
  fromUserId: string
  toUserId: string
  paperId?: string
  reviewId?: string
  amountCents: number
  message?: string
}): Promise<{ clientSecret: string; tipId: string }> {
  const receiver = await prisma.user.findUnique({ where: { id: params.toUserId } })
  if (!receiver?.stripeAccountId) throw new Error('Receiver has no connected Stripe account')

  if (!stripe) {
    const tip = await prisma.tip.create({
      data: {
        senderId: params.fromUserId,
        receiverId: params.toUserId,
        paperId: params.paperId ?? null,
        reviewId: params.reviewId ?? null,
        amountCents: params.amountCents,
        currency: 'usd',
        stripePaymentId: `pi_mock_${Date.now()}`,
        status: 'PENDING' as any,
        message: params.message ?? null,
      } as any,
    })
    return { clientSecret: 'mock_client_secret', tipId: tip.id }
  }

  const intent = await stripe.paymentIntents.create({
    amount: params.amountCents,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    transfer_data: {
      destination: receiver.stripeAccountId,
    },
    metadata: {
      toUserId: params.toUserId,
      fromUserId: params.fromUserId,
      paperId: params.paperId ?? '',
      reviewId: params.reviewId ?? '',
    },
  })

  const tip = await prisma.tip.create({
    data: {
      senderId: params.fromUserId,
      receiverId: params.toUserId,
      paperId: params.paperId ?? null,
      reviewId: params.reviewId ?? null,
      amountCents: params.amountCents,
      currency: 'usd',
      stripePaymentId: intent.id,
      status: 'PENDING' as any,
      message: params.message ?? null,
    } as any,
  })

  return { clientSecret: intent.client_secret ?? '', tipId: tip.id }
}

export async function processWebhook(payload: Buffer, signature: string): Promise<void> {
  if (!stripe || !webhookSecret) return

  const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const tip = await prisma.tip.findUnique({ where: { stripePaymentId: pi.id } })
    if (!tip) return

    await prisma.tip.update({
      where: { id: tip.id },
      data: { status: 'COMPLETED' as any },
    })

    await addNotificationJob({
      userId: tip.receiverId,
      type: 'TIP_RECEIVED',
      title: 'Tip received',
      message: `You received a $${(tip.amountCents / 100).toFixed(2)} tip.`,
      link: '/dashboard/reviewer',
      metadata: { tipId: tip.id },
    })

    const receiver = await prisma.user.findUnique({ where: { id: tip.receiverId } })
    if (receiver?.email && receiver.name) {
      await addEmailJob({
        name: 'payoutProcessed',
        data: { reviewer: { name: receiver.name, email: receiver.email }, amountCents: tip.amountCents },
      })
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent
    const tip = await prisma.tip.findUnique({ where: { stripePaymentId: pi.id } })
    if (!tip) return
    await prisma.tip.update({
      where: { id: tip.id },
      data: { status: 'FAILED' as any },
    })
  }
}

export async function getPayoutHistory(stripeAccountId: string): Promise<any[]> {
  if (!stripe) return []
  const payouts = await stripe.payouts.list({ limit: 20 }, { stripeAccount: stripeAccountId })
  return payouts.data.map((p) => ({
    id: p.id,
    amountCents: p.amount,
    currency: p.currency,
    status: p.status,
    arrivalDate: p.arrival_date ? new Date(p.arrival_date * 1000).toISOString() : null,
  }))
}

