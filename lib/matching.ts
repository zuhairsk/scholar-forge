import { prisma } from './prisma'

function safeParseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export async function matchReviewersToPaper(paperId: string, count: number = 3): Promise<any[]> {
  const paper = await prisma.paper.findUnique({
    where: { id: paperId },
    include: { author: true, coAuthors: true },
  })
  if (!paper) throw new Error('Paper not found')

  const reviewers = await prisma.user.findMany({
    where: {
      role: 'REVIEWER',
      isVerified: true,
      id: { not: paper.authorId },
      reviewerProfile: { isNot: null },
    },
    include: {
      reviewerProfile: true,
    },
  })

  const eligible = []
  for (const u of reviewers) {
    const profile = u.reviewerProfile
    if (!profile) continue
    if (!profile.isAvailable) continue

    const domains = safeParseJSON<string[]>(profile.domains, [])
    if (!domains.includes(paper.domain)) continue

    // exclude coauthors by email if claimed to a userId
    const isCoAuthor = paper.coAuthors.some((c) => c.userId && c.userId === u.id)
    if (isCoAuthor) continue

    eligible.push(u)
  }

  const results: { user: any; score: number }[] = []

  // Precompute prior domain experience per reviewer
  const priorReviews = await prisma.review.findMany({
    where: { reviewerId: { in: eligible.map((u) => u.id) }, submittedAt: { not: null } },
    include: { paper: true },
  })
  const domainExperience = new Map<string, Set<string>>() // reviewerId -> set(domains)
  for (const r of priorReviews) {
    const set = domainExperience.get(r.reviewerId) ?? new Set<string>()
    if (r.paper?.domain) set.add(r.paper.domain)
    domainExperience.set(r.reviewerId, set)
  }

  for (const u of eligible) {
    const profile = u.reviewerProfile!
    const proficiency = safeParseJSON<Record<string, number>>(profile.proficiency, {})
    const prof = proficiency[paper.domain] ?? 0
    if (prof < 3) continue

    const activeCount = await prisma.review.count({
      where: { reviewerId: u.id, submittedAt: null },
    })
    if (activeCount >= profile.maxActiveReviews) continue

    const hasReviewedPaper = await prisma.review.findFirst({
      where: { reviewerId: u.id, paperId: paper.id },
      select: { id: true },
    })
    if (hasReviewedPaper) continue

    let score = 0
    if (prof === 5) score += 30
    else if (prof === 4) score += 20
    else if (prof === 3) score += 10

    const exp = domainExperience.get(u.id)
    if (exp && exp.has(paper.domain)) score += 20

    if (activeCount === 0) score += 10
    score -= activeCount * 5

    if (u.level >= 3) score += 15

    results.push({ user: u, score })
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, count).map((r) => r.user)
}

export async function assignReviewer(paperId: string, reviewerId: string, adminId: string): Promise<any> {
  const [paper, settings] = await Promise.all([
    prisma.paper.findUnique({ where: { id: paperId }, include: { author: true } }),
    prisma.systemSettings.findUnique({ where: { id: 'singleton' } }),
  ])
  if (!paper) throw new Error('Paper not found')

  const slaHours = settings?.reviewSLAHours ?? 72
  const now = new Date()
  const deadlineAt = new Date(now.getTime() + slaHours * 60 * 60 * 1000)

  const review = await prisma.review.create({
    data: {
      paperId,
      reviewerId,
      summary: '',
      strengths: '',
      weaknesses: '',
      clarityScore: 1,
      methodologyScore: 1,
      noveltyScore: 1,
      reproducibilityScore: 1,
      impactScore: 1,
      overallScore: 1,
      recommendation: 'MINOR_REVISION' as any,
      claimedAt: now,
      deadlineAt,
    } as any,
  })

  await prisma.paper.update({
    where: { id: paperId },
    data: { status: 'UNDER_REVIEW' as any },
  })

  await prisma.notification.create({
    data: {
      userId: reviewerId,
      type: 'REVIEW_MATCHED' as any,
      title: 'New paper assigned',
      message: `You have been matched to review: ${paper.title}`,
      link: `/dashboard/reviewer/active/${review.id}`,
      metadata: JSON.stringify({ paperId, reviewId: review.id, adminId }),
      isRead: false,
    } as any,
  })

  await prisma.notification.create({
    data: {
      userId: paper.authorId,
      type: 'REVIEW_MATCHED' as any,
      title: 'Reviewer matched',
      message: `A reviewer has been assigned to your paper: ${paper.title}`,
      link: `/paper/${paperId}`,
      metadata: JSON.stringify({ paperId, reviewId: review.id }),
      isRead: false,
    } as any,
  })

  return review
}

