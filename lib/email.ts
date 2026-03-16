import { Resend } from 'resend'

const FROM = 'ScholarForge <noreply@scholarforge.dev>'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null

function baseHtml({ title, greeting, body, ctaLabel, ctaUrl }: { title: string; greeting: string; body: string; ctaLabel?: string; ctaUrl?: string }) {
  const button = ctaLabel && ctaUrl
    ? `<a href="${ctaUrl}" style="display:inline-block;margin-top:16px;padding:12px 18px;border-radius:10px;background:#d4a843;color:#0a0b0f;text-decoration:none;font-weight:700;">${ctaLabel}</a>`
    : ''

  return `
  <div style="background:#0a0b0f;padding:32px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#f0ece3;">
    <div style="max-width:620px;margin:0 auto;border:1px solid rgba(212,168,67,0.18);border-radius:16px;overflow:hidden;">
      <div style="padding:22px 24px;background:linear-gradient(135deg, rgba(212,168,67,0.18), rgba(13,148,136,0.08));border-bottom:1px solid rgba(212,168,67,0.18);">
        <div style="font-family:Georgia,serif;font-size:20px;font-weight:700;letter-spacing:0.4px;color:#d4a843;">ScholarForge</div>
        <div style="margin-top:8px;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#f0ece3;">${title}</div>
      </div>
      <div style="padding:24px;">
        <div style="font-size:16px;line-height:1.5;margin-bottom:14px;">${greeting}</div>
        <div style="font-size:15px;line-height:1.7;color:#f0ece3;opacity:0.92;">${body}</div>
        ${button}
        <div style="margin-top:26px;font-size:12px;color:#8b8680;border-top:1px solid rgba(212,168,67,0.12);padding-top:16px;">
          © 2026 ScholarForge · Unsubscribe
        </div>
      </div>
    </div>
  </div>`
}

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set; logging email instead')
    console.log({ to, subject, html })
    return
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
  } catch (e) {
    console.error('[email] send failed', e)
  }
}

export async function sendWelcomeEmail(user: { name: string; email: string; role: string }) {
  const html = baseHtml({
    title: 'Welcome',
    greeting: `Hi ${user.name},`,
    body: `Welcome to ScholarForge. Your role is <b style="color:#d4a843;">${user.role}</b>. Start exploring papers and leveling up through high-quality reviews.`,
    ctaLabel: 'Open ScholarForge',
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/`,
  })
  await send(user.email, 'Welcome to ScholarForge', html)
}

export async function sendReviewCompletedEmail(
  author: { name: string; email: string },
  paper: { title: string },
  review: { overallScore: number; recommendation: string },
) {
  const html = baseHtml({
    title: 'Review received',
    greeting: `Hi ${author.name},`,
    body: `A review has been submitted for <b>${paper.title}</b>.<br/><br/>Overall score: <b style="color:#d4a843;">${review.overallScore.toFixed(
      1,
    )}</b><br/>Recommendation: <b style="color:#d4a843;">${review.recommendation}</b>`,
    ctaLabel: 'View paper',
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/explore`,
  })
  await send(author.email, `New review for: ${paper.title}`, html)
}

export async function sendReviewMatchedEmail(
  reviewer: { name: string; email: string },
  paper: { title: string; domain: string; estimatedReadTime: number },
) {
  const html = baseHtml({
    title: 'New paper matched',
    greeting: `Hi ${reviewer.name},`,
    body: `You’ve been matched to review <b>${paper.title}</b>.<br/><br/>Domain: <b style="color:#d4a843;">${paper.domain}</b><br/>Estimated read time: <b style="color:#d4a843;">${paper.estimatedReadTime} min</b>`,
    ctaLabel: 'Open dashboard',
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard/reviewer`,
  })
  await send(reviewer.email, `New review match: ${paper.title}`, html)
}

export async function sendVerificationApprovedEmail(reviewer: { name: string; email: string }) {
  const html = baseHtml({
    title: 'Verification approved',
    greeting: `Hi ${reviewer.name},`,
    body: `Your reviewer verification has been approved. You can now claim papers and start earning XP and badges.`,
    ctaLabel: 'Go to reviewer dashboard',
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard/reviewer`,
  })
  await send(reviewer.email, 'ScholarForge verification approved', html)
}

export async function sendVerificationRejectedEmail(reviewer: { name: string; email: string }, reason: string) {
  const html = baseHtml({
    title: 'Verification update',
    greeting: `Hi ${reviewer.name},`,
    body: `We couldn’t approve your reviewer verification.<br/><br/><b>Reason:</b> ${reason}`,
    ctaLabel: 'Update your application',
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard/reviewer`,
  })
  await send(reviewer.email, 'ScholarForge verification update', html)
}

export async function sendLevelUpEmail(user: { name: string; email: string }, newLevel: number, levelName: string) {
  const html = baseHtml({
    title: 'Level up!',
    greeting: `Hi ${user.name},`,
    body: `You reached <b style="color:#d4a843;">Level ${newLevel}</b> — ${levelName}. Keep forging great reviews.`,
    ctaLabel: 'See your progress',
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard/reviewer`,
  })
  await send(user.email, `You reached Level ${newLevel}`, html)
}

export async function sendWeeklyXPSummaryEmail(
  user: { name: string; email: string },
  weekXP: number,
  rank: number,
  totalReviews: number,
) {
  const html = baseHtml({
    title: 'Weekly XP summary',
    greeting: `Hi ${user.name},`,
    body: `This week you earned <b style="color:#d4a843;">${weekXP} XP</b>.<br/>Rank: <b style="color:#d4a843;">#${rank}</b><br/>Reviews: <b style="color:#d4a843;">${totalReviews}</b>`,
    ctaLabel: 'View leaderboard',
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/leaderboard`,
  })
  await send(user.email, 'Your ScholarForge weekly summary', html)
}

export async function sendPayoutProcessedEmail(reviewer: { name: string; email: string }, amountCents: number) {
  const dollars = (amountCents / 100).toFixed(2)
  const html = baseHtml({
    title: 'Payout processed',
    greeting: `Hi ${reviewer.name},`,
    body: `A payout of <b style="color:#d4a843;">$${dollars}</b> has been processed to your connected account.`,
    ctaLabel: 'View earnings',
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dashboard/reviewer`,
  })
  await send(reviewer.email, 'ScholarForge payout processed', html)
}

export async function sendEmailVerificationEmail(user: { name: string; email: string }, verificationUrl: string) {
  const html = baseHtml({
    title: 'Verify your email',
    greeting: `Hi ${user.name},`,
    body: `Please verify your email address to secure your account.`,
    ctaLabel: 'Verify email',
    ctaUrl: verificationUrl,
  })
  await send(user.email, 'Verify your ScholarForge email', html)
}

export async function sendPasswordResetEmail(user: { name: string; email: string }, resetUrl: string) {
  const html = baseHtml({
    title: 'Reset your password',
    greeting: `Hi ${user.name},`,
    body: `A password reset was requested for your account. If this wasn’t you, you can ignore this email.`,
    ctaLabel: 'Reset password',
    ctaUrl: resetUrl,
  })
  await send(user.email, 'Reset your ScholarForge password', html)
}

