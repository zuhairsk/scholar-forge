import { prisma } from './prisma'
import { awardXP } from './xp'

export type BadgeCheckContext = {
  totalReviews?: number
  streakDays?: number
  helpfulVotes?: number
  level?: number
  domainCounts?: Record<string, number>
  reviewDurationHours?: number
  allScoresTen?: boolean
  isVerified?: boolean
  avgReviewWords?: number
}

export type BadgeDefinition = {
  slug: string
  name: string
  description: string
  iconEmoji: string
  category: 'MILESTONE' | 'QUALITY' | 'SPEED' | 'STREAK' | 'DOMAIN' | 'SOCIAL' | 'SPECIAL' | 'RARE'
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  xpReward: number
  condition: Record<string, any>
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { slug: "first-review", name: "First Steps", description: "Complete your first review.", iconEmoji: "🪶", category: "MILESTONE", rarity: "COMMON", xpReward: 25, condition: { type: "review_count", threshold: 1 } },
  { slug: "ten-reviews", name: "Getting Started", description: "Complete 10 reviews.", iconEmoji: "📚", category: "MILESTONE", rarity: "COMMON", xpReward: 50, condition: { type: "review_count", threshold: 10 } },
  { slug: "fifty-reviews", name: "Dedicated Scholar", description: "Complete 50 reviews.", iconEmoji: "🏛️", category: "MILESTONE", rarity: "UNCOMMON", xpReward: 150, condition: { type: "review_count", threshold: 50 } },
  { slug: "hundred-reviews", name: "Century Mark", description: "Complete 100 reviews.", iconEmoji: "💯", category: "MILESTONE", rarity: "RARE", xpReward: 300, condition: { type: "review_count", threshold: 100 } },
  { slug: "five-hundred-reviews", name: "Legend", description: "Complete 500 reviews.", iconEmoji: "👑", category: "MILESTONE", rarity: "LEGENDARY", xpReward: 1000, condition: { type: "review_count", threshold: 500 } },
  { slug: "three-day-streak", name: "On a Roll", description: "Maintain a 3-day streak.", iconEmoji: "🔥", category: "STREAK", rarity: "COMMON", xpReward: 30, condition: { type: "streak_days", threshold: 3 } },
  { slug: "seven-day-streak", name: "Week Warrior", description: "Maintain a 7-day streak.", iconEmoji: "🛡️", category: "STREAK", rarity: "UNCOMMON", xpReward: 75, condition: { type: "streak_days", threshold: 7 } },
  { slug: "thirty-day-streak", name: "Iron Will", description: "Maintain a 30-day streak.", iconEmoji: "⚔️", category: "STREAK", rarity: "EPIC", xpReward: 500, condition: { type: "streak_days", threshold: 30 } },
  { slug: "helpful-reviewer", name: "Community Pillar", description: "Earn 25 helpful votes.", iconEmoji: "🤝", category: "QUALITY", rarity: "UNCOMMON", xpReward: 100, condition: { type: "helpful_votes", threshold: 25 } },
  { slug: "perfect-score", name: "Perfectionist", description: "Submit a perfect-score review.", iconEmoji: "✨", category: "QUALITY", rarity: "EPIC", xpReward: 200, condition: { type: "perfect_review", threshold: 1 } },
  { slug: "domain-expert-cs", name: "CS Domain Expert", description: "Complete 20 CS reviews.", iconEmoji: "💻", category: "DOMAIN", rarity: "RARE", xpReward: 200, condition: { type: "domain_reviews", domain: "Computer Science", threshold: 20 } },
  { slug: "domain-expert-bio", name: "Bio Domain Expert", description: "Complete 20 Biology reviews.", iconEmoji: "🧬", category: "DOMAIN", rarity: "RARE", xpReward: 200, condition: { type: "domain_reviews", domain: "Biology", threshold: 20 } },
  { slug: "night-owl", name: "Night Owl", description: "Review between 2–5am.", iconEmoji: "🦉", category: "SPECIAL", rarity: "UNCOMMON", xpReward: 50, condition: { type: "review_time_range", startHour: 2, endHour: 5 } },
  { slug: "scholar-level", name: "Scholar", description: "Reach level 2.", iconEmoji: "🎓", category: "MILESTONE", rarity: "COMMON", xpReward: 100, condition: { type: "level_reached", level: 2 } },
  { slug: "expert-level", name: "Expert", description: "Reach level 4.", iconEmoji: "🧠", category: "MILESTONE", rarity: "RARE", xpReward: 300, condition: { type: "level_reached", level: 4 } },
  { slug: "luminary", name: "Luminary", description: "Reach level 6.", iconEmoji: "🌟", category: "RARE", rarity: "LEGENDARY", xpReward: 2000, condition: { type: "level_reached", level: 6 } },
  { slug: "pioneer", name: "Pioneer", description: "Be among the first 100 users.", iconEmoji: "🚀", category: "SPECIAL", rarity: "EPIC", xpReward: 500, condition: { type: "registration_order", threshold: 100 } },
  { slug: "fast-reviewer", name: "Lightning", description: "Submit a review within 2 hours.", iconEmoji: "⚡", category: "SPEED", rarity: "UNCOMMON", xpReward: 75, condition: { type: "review_within_hours", threshold: 2 } },
  { slug: "on-time", name: "Reliable", description: "Submit 10 reviews before deadline.", iconEmoji: "⏱️", category: "SPEED", rarity: "COMMON", xpReward: 50, condition: { type: "reviews_before_deadline", threshold: 10 } },
  { slug: "top-weekly", name: "Weekly Champion", description: "Awarded by admins.", iconEmoji: "🏆", category: "SPECIAL", rarity: "EPIC", xpReward: 300, condition: { type: "admin_awarded", slug: "top-weekly" } },
  { slug: "tipper", name: "Generous", description: "Send 5 tips.", iconEmoji: "💛", category: "SOCIAL", rarity: "UNCOMMON", xpReward: 50, condition: { type: "tips_sent", threshold: 5 } },
  { slug: "earning-reviewer", name: "Side Hustler", description: "Receive 10 tips.", iconEmoji: "💰", category: "SPECIAL", rarity: "RARE", xpReward: 100, condition: { type: "tips_received_count", threshold: 10 } },
  { slug: "detailed-reviewer", name: "Thorough", description: "Average 300+ words per review.", iconEmoji: "📝", category: "QUALITY", rarity: "UNCOMMON", xpReward: 75, condition: { type: "avg_review_words", threshold: 300 } },
  { slug: "verified-expert", name: "Verified Expert", description: "Get verified as a reviewer.", iconEmoji: "✅", category: "SPECIAL", rarity: "RARE", xpReward: 200, condition: { type: "reviewer_verified", threshold: 1 } },
  { slug: "mentor", name: "Mentor", description: "Help 5 revision cycles.", iconEmoji: "🧭", category: "SOCIAL", rarity: "EPIC", xpReward: 400, condition: { type: "revision_cycles_helped", threshold: 5 } },
]

function safeParseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function matchesCondition(condition: any, ctx: BadgeCheckContext): boolean {
  const type = condition?.type
  switch (type) {
    case 'review_count':
      return (ctx.totalReviews ?? 0) >= (condition.threshold ?? 0)
    case 'streak_days':
      return (ctx.streakDays ?? 0) >= (condition.threshold ?? 0)
    case 'helpful_votes':
      return (ctx.helpfulVotes ?? 0) >= (condition.threshold ?? 0)
    case 'level_reached':
      return (ctx.level ?? 1) >= (condition.level ?? 1)
    case 'domain_reviews': {
      const domain = String(condition.domain ?? '')
      const counts = ctx.domainCounts ?? {}
      return (counts[domain] ?? 0) >= (condition.threshold ?? 0)
    }
    case 'review_within_hours':
      return typeof ctx.reviewDurationHours === 'number' && ctx.reviewDurationHours <= (condition.threshold ?? 0)
    case 'perfect_review':
      return ctx.allScoresTen === true
    case 'reviewer_verified':
      return ctx.isVerified === true
    case 'avg_review_words':
      return (ctx.avgReviewWords ?? 0) >= (condition.threshold ?? 0)
    default:
      return false
  }
}

export async function checkAndAwardBadges(userId: string, context: BadgeCheckContext): Promise<any[]> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const notOwned = await prisma.badge.findMany({
    where: { users: { none: { userId } }, isActive: true },
  })

  const newlyAwarded: any[] = []

  for (const badge of notOwned) {
    const condition = safeParseJSON<any>(badge.condition, {})
    if (!matchesCondition(condition, context)) continue

    try {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
          awardNote: 'Unlocked automatically',
        },
      })
    } catch {
      // idempotency / race
      continue
    }

    await prisma.notification.create({
      data: {
        userId,
        type: 'BADGE_UNLOCKED' as any,
        title: `Badge unlocked: ${badge.name}`,
        message: badge.description,
        link: '/dashboard/reviewer/badges',
        metadata: JSON.stringify({ badgeSlug: badge.slug }),
        isRead: false,
      } as any,
    })

    if (badge.xpReward && badge.xpReward !== 0) {
      await awardXP(userId, badge.xpReward, 'badge_unlocked', { badgeId: badge.id, badgeSlug: badge.slug })
    }

    newlyAwarded.push(badge)
  }

  return newlyAwarded
}

export async function awardBadge(userId: string, badgeSlug: string, note?: string): Promise<any> {
  const badge = await prisma.badge.findUnique({ where: { slug: badgeSlug } })
  if (!badge) return null

  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  })
  if (existing) return badge

  await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
      awardNote: note ?? 'Awarded',
    },
  })

  await prisma.notification.create({
    data: {
      userId,
      type: 'BADGE_UNLOCKED' as any,
      title: `Badge awarded: ${badge.name}`,
      message: badge.description,
      link: '/dashboard/reviewer/badges',
      metadata: JSON.stringify({ badgeSlug: badge.slug, manual: true }),
      isRead: false,
    } as any,
  })

  if (badge.xpReward && badge.xpReward !== 0) {
    await awardXP(userId, badge.xpReward, 'badge_awarded', { badgeId: badge.id, badgeSlug: badge.slug })
  }

  return badge
}

async function computeContextForProgress(userId: string): Promise<BadgeCheckContext> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const reviews = await prisma.review.findMany({
    where: { reviewerId: userId, submittedAt: { not: null } },
    include: { paper: true },
  })

  const domainCounts: Record<string, number> = {}
  let totalWords = 0
  for (const r of reviews) {
    const domain = r.paper?.domain ?? 'Unknown'
    domainCounts[domain] = (domainCounts[domain] ?? 0) + 1
    totalWords += `${r.summary} ${r.strengths} ${r.weaknesses}`.trim().split(/\s+/).filter(Boolean).length
  }

  const avgReviewWords = reviews.length > 0 ? Math.round(totalWords / reviews.length) : 0

  return {
    totalReviews: user.totalReviews,
    streakDays: user.streakDays,
    helpfulVotes: user.helpfulVotesTotal,
    level: user.level,
    domainCounts,
    avgReviewWords,
    isVerified: user.isVerified,
  }
}

export async function getBadgeProgress(
  userId: string,
  badgeSlug: string,
): Promise<{ current: number; target: number; percent: number }> {
  const badge = await prisma.badge.findUnique({ where: { slug: badgeSlug } })
  if (!badge) throw new Error('Badge not found')

  const condition = safeParseJSON<any>(badge.condition, {})
  const ctx = await computeContextForProgress(userId)

  let current = 0
  let target = 1

  switch (condition.type) {
    case 'review_count':
      current = ctx.totalReviews ?? 0
      target = condition.threshold ?? 0
      break
    case 'streak_days':
      current = ctx.streakDays ?? 0
      target = condition.threshold ?? 0
      break
    case 'helpful_votes':
      current = ctx.helpfulVotes ?? 0
      target = condition.threshold ?? 0
      break
    case 'level_reached':
      current = ctx.level ?? 1
      target = condition.level ?? 1
      break
    case 'domain_reviews': {
      const domain = String(condition.domain ?? '')
      current = (ctx.domainCounts ?? {})[domain] ?? 0
      target = condition.threshold ?? 0
      break
    }
    case 'avg_review_words':
      current = ctx.avgReviewWords ?? 0
      target = condition.threshold ?? 0
      break
    case 'reviewer_verified':
      current = ctx.isVerified ? 1 : 0
      target = 1
      break
    case 'perfect_review':
      current = 0
      target = 1
      break
    case 'review_within_hours':
      current = 0
      target = 1
      break
    default:
      current = 0
      target = 1
  }

  const percent = target <= 0 ? 100 : Math.max(0, Math.min(100, Math.round((current / target) * 100)))
  return { current, target, percent }
}

