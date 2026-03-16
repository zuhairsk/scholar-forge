import { prisma } from './prisma'
import { isMockRedis, redis } from './redis'
import { awardXP } from './xp'
import { checkAndAwardBadges, type BadgeCheckContext } from './badges'
import * as email from './email'

type EmailJob =
  | { name: 'welcome'; data: Parameters<typeof email.sendWelcomeEmail>[0] }
  | { name: 'reviewCompleted'; data: { author: { name: string; email: string }; paper: { title: string }; review: { overallScore: number; recommendation: string } } }
  | { name: 'reviewMatched'; data: { reviewer: { name: string; email: string }; paper: { title: string; domain: string; estimatedReadTime: number } } }
  | { name: 'verificationApproved'; data: Parameters<typeof email.sendVerificationApprovedEmail>[0] }
  | { name: 'verificationRejected'; data: { reviewer: { name: string; email: string }; reason: string } }
  | { name: 'levelUp'; data: { user: { name: string; email: string }; newLevel: number; levelName: string } }
  | { name: 'weeklySummary'; data: { user: { name: string; email: string }; weekXP: number; rank: number; totalReviews: number } }
  | { name: 'payoutProcessed'; data: { reviewer: { name: string; email: string }; amountCents: number } }
  | { name: 'emailVerification'; data: { user: { name: string; email: string }; verificationUrl: string } }
  | { name: 'passwordReset'; data: { user: { name: string; email: string }; resetUrl: string } }

type XPJob = { userId: string; amount: number; reason: string; metadata?: Record<string, unknown> }
type BadgeCheckJob = { userId: string; context: BadgeCheckContext }
type NotificationJob = {
  userId: string
  type: any
  title: string
  message: string
  link?: string
  metadata?: Record<string, unknown>
}

async function processEmailJob(job: EmailJob) {
  switch (job.name) {
    case 'welcome':
      await email.sendWelcomeEmail(job.data)
      return
    case 'reviewCompleted':
      await email.sendReviewCompletedEmail(job.data.author, job.data.paper, job.data.review)
      return
    case 'reviewMatched':
      await email.sendReviewMatchedEmail(job.data.reviewer, job.data.paper)
      return
    case 'verificationApproved':
      await email.sendVerificationApprovedEmail(job.data)
      return
    case 'verificationRejected':
      await email.sendVerificationRejectedEmail(job.data.reviewer, job.data.reason)
      return
    case 'levelUp':
      await email.sendLevelUpEmail(job.data.user, job.data.newLevel, job.data.levelName)
      return
    case 'weeklySummary':
      await email.sendWeeklyXPSummaryEmail(job.data.user, job.data.weekXP, job.data.rank, job.data.totalReviews)
      return
    case 'payoutProcessed':
      await email.sendPayoutProcessedEmail(job.data.reviewer, job.data.amountCents)
      return
    case 'emailVerification':
      await email.sendEmailVerificationEmail(job.data.user, job.data.verificationUrl)
      return
    case 'passwordReset':
      await email.sendPasswordResetEmail(job.data.user, job.data.resetUrl)
      return
  }
}

async function processXPJob(job: XPJob) {
  await awardXP(job.userId, job.amount, job.reason, job.metadata)
}

async function processBadgeCheckJob(job: BadgeCheckJob) {
  await checkAndAwardBadges(job.userId, job.context)
}

async function processNotificationJob(job: NotificationJob) {
  await prisma.notification.create({
    data: {
      userId: job.userId,
      type: job.type,
      title: job.title,
      message: job.message,
      link: job.link ?? null,
      metadata: job.metadata ? JSON.stringify(job.metadata) : null,
      isRead: false,
    } as any,
  })
}

// BullMQ optional path (only when real Redis is configured)
let bull: any = null
async function getBull() {
  if (bull) return bull
  try {
    bull = await import('bullmq')
    return bull
  } catch {
    return null
  }
}

type QueueMode = 'sync' | 'bullmq'
const mode: QueueMode = !isMockRedis ? 'bullmq' : 'sync'

let emailQueue: any
let xpQueue: any
let badgeQueue: any
let notificationQueue: any

async function ensureQueues() {
  if (mode !== 'bullmq') return
  if (emailQueue) return

  const bullmq = await getBull()
  if (!bullmq) return

  const { Queue, Worker } = bullmq
  const connection = redis as any

  emailQueue = new Queue('emailQueue', { connection })
  xpQueue = new Queue('xpQueue', { connection })
  badgeQueue = new Queue('badgeCheckQueue', { connection })
  notificationQueue = new Queue('notificationQueue', { connection })

  new Worker(
    'emailQueue',
    async (job: any) => processEmailJob(job.data as EmailJob),
    { connection },
  )
  new Worker('xpQueue', async (job: any) => processXPJob(job.data as XPJob), { connection })
  new Worker(
    'badgeCheckQueue',
    async (job: any) => processBadgeCheckJob(job.data as BadgeCheckJob),
    { connection },
  )
  new Worker(
    'notificationQueue',
    async (job: any) => processNotificationJob(job.data as NotificationJob),
    { connection },
  )
}

export async function addEmailJob(job: EmailJob) {
  if (mode === 'sync') return processEmailJob(job)
  await ensureQueues()
  return emailQueue.add(job.name, job, { attempts: 3 })
}

export async function addXPJob(job: XPJob) {
  if (mode === 'sync') return processXPJob(job)
  await ensureQueues()
  return xpQueue.add('awardXP', job, { attempts: 3 })
}

export async function addBadgeCheckJob(job: BadgeCheckJob) {
  if (mode === 'sync') return processBadgeCheckJob(job)
  await ensureQueues()
  return badgeQueue.add('checkBadges', job, { attempts: 3 })
}

export async function addNotificationJob(job: NotificationJob) {
  if (mode === 'sync') return processNotificationJob(job)
  await ensureQueues()
  return notificationQueue.add('notify', job, { attempts: 3 })
}

