import { prisma } from './prisma'

export const XP_REWARDS = {
  REVIEW_COMPLETED: 50,
  REVIEW_HELPFUL_VOTE: 30,
  DAILY_STREAK: 20,
  TOP_REVIEW_AWARD: 100,
  MONTHLY_TOP_REVIEWER: 200,
  PROFILE_COMPLETED: 15,
  REFERRAL_VERIFIED: 10,
  QUALITY_PENALTY: -20,
} as const

export const LEVEL_THRESHOLDS = [0, 500, 1000, 2000, 3500, 5000] as const
export const LEVEL_NAMES = ['Initiate', 'Scholar', 'Fellow', 'Expert', 'Distinguished', 'Luminary'] as const

export function calculateLevel(xp: number): number {
  const safeXP = Math.max(0, Math.floor(xp || 0))
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (safeXP >= LEVEL_THRESHOLDS[i]) level = i + 1
  }
  return Math.min(level, LEVEL_THRESHOLDS.length)
}

export function getLevelName(level: number): string {
  const idx = Math.min(Math.max(1, Math.floor(level || 1)), LEVEL_NAMES.length) - 1
  return LEVEL_NAMES[idx]
}

export function getXPToNextLevel(xp: number): number {
  const lvl = calculateLevel(xp)
  if (lvl >= LEVEL_THRESHOLDS.length) return 0
  const nextThreshold = LEVEL_THRESHOLDS[lvl]
  return Math.max(0, nextThreshold - Math.max(0, xp))
}

export function getLevelProgress(xp: number): number {
  const safeXP = Math.max(0, xp || 0)
  const lvl = calculateLevel(safeXP)
  const idx = lvl - 1
  const currentStart = LEVEL_THRESHOLDS[idx] ?? 0
  const next = LEVEL_THRESHOLDS[idx + 1]
  if (next === undefined) return 100
  const span = next - currentStart
  if (span <= 0) return 100
  const within = Math.min(Math.max(0, safeXP - currentStart), span)
  return Math.round((within / span) * 100)
}

export async function awardXP(
  userId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, unknown>,
): Promise<{
  newXP: number
  newLevel: number
  leveledUp: boolean
  previousLevel: number
}> {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User not found')

    const previousLevel = user.level
    const updated = await tx.user.update({
      where: { id: userId },
      data: {
        xp: { increment: amount },
      },
    })

    await tx.xPLog.create({
      data: {
        userId,
        amount,
        reason,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    })

    const newLevel = calculateLevel(updated.xp)
    const leveledUp = newLevel !== previousLevel

    if (leveledUp) {
      await tx.user.update({
        where: { id: userId },
        data: { level: newLevel },
      })
      await tx.notification.create({
        data: {
          userId,
          type: 'LEVEL_UP' as any,
          title: 'Level Up!',
          message: `You reached level ${newLevel} (${getLevelName(newLevel)}).`,
          link: '/dashboard',
          isRead: false,
        } as any,
      })
    }

    return {
      newXP: updated.xp,
      newLevel,
      leveledUp,
      previousLevel,
    }
  })
}

export async function deductXP(userId: string, amount: number, reason: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User not found')

    const deduct = Math.max(0, Math.floor(amount || 0))
    const nextXP = Math.max(0, user.xp - deduct)

    await tx.user.update({
      where: { id: userId },
      data: { xp: nextXP },
    })

    await tx.xPLog.create({
      data: {
        userId,
        amount: -deduct,
        reason,
        metadata: null,
      },
    })

    const newLevel = calculateLevel(nextXP)
    if (newLevel !== user.level) {
      await tx.user.update({ where: { id: userId }, data: { level: newLevel } })
    }
  })
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export async function updateStreak(userId: string): Promise<number> {
  const now = new Date()
  const today = startOfDay(now)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User not found')

    const last = user.lastReviewDate ? startOfDay(user.lastReviewDate) : null
    let streak = user.streakDays || 0

    if (last && last.getTime() === today.getTime()) {
      // already counted today
      return streak
    }

    if (last && last.getTime() === yesterday.getTime()) {
      streak = streak + 1
      await awardXP(userId, XP_REWARDS.DAILY_STREAK, 'daily_streak', { streak })
    } else {
      streak = 1
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        lastReviewDate: now,
        streakDays: streak,
      },
    })

    return streak
  })
}

