import { PrismaClient, Role, PaperStatus, ReviewRecommendation, VerificationStatus, TipStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function nowMinusDays(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

async function upsertSystemSettings() {
  await prisma.systemSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  })
}

type BadgeSeed = {
  slug: string
  name: string
  description: string
  iconEmoji: string
  category: any
  rarity: any
  xpReward: number
  condition: string
}

const BADGES: BadgeSeed[] = [
  { slug: "first-review", name: "First Steps", description: "Complete your first review.", iconEmoji: "🪶", category: "MILESTONE", rarity: "COMMON", xpReward: 25, condition: JSON.stringify({ type: "review_count", threshold: 1 }) },
  { slug: "ten-reviews", name: "Getting Started", description: "Complete 10 reviews.", iconEmoji: "📚", category: "MILESTONE", rarity: "COMMON", xpReward: 50, condition: JSON.stringify({ type: "review_count", threshold: 10 }) },
  { slug: "fifty-reviews", name: "Dedicated Scholar", description: "Complete 50 reviews.", iconEmoji: "🏛️", category: "MILESTONE", rarity: "UNCOMMON", xpReward: 150, condition: JSON.stringify({ type: "review_count", threshold: 50 }) },
  { slug: "hundred-reviews", name: "Century Mark", description: "Complete 100 reviews.", iconEmoji: "💯", category: "MILESTONE", rarity: "RARE", xpReward: 300, condition: JSON.stringify({ type: "review_count", threshold: 100 }) },
  { slug: "five-hundred-reviews", name: "Legend", description: "Complete 500 reviews.", iconEmoji: "👑", category: "MILESTONE", rarity: "LEGENDARY", xpReward: 1000, condition: JSON.stringify({ type: "review_count", threshold: 500 }) },
  { slug: "three-day-streak", name: "On a Roll", description: "Maintain a 3-day review streak.", iconEmoji: "🔥", category: "STREAK", rarity: "COMMON", xpReward: 30, condition: JSON.stringify({ type: "streak_days", threshold: 3 }) },
  { slug: "seven-day-streak", name: "Week Warrior", description: "Maintain a 7-day review streak.", iconEmoji: "🛡️", category: "STREAK", rarity: "UNCOMMON", xpReward: 75, condition: JSON.stringify({ type: "streak_days", threshold: 7 }) },
  { slug: "thirty-day-streak", name: "Iron Will", description: "Maintain a 30-day review streak.", iconEmoji: "⚔️", category: "STREAK", rarity: "EPIC", xpReward: 500, condition: JSON.stringify({ type: "streak_days", threshold: 30 }) },
  { slug: "helpful-reviewer", name: "Community Pillar", description: "Earn 25 helpful votes.", iconEmoji: "🤝", category: "QUALITY", rarity: "UNCOMMON", xpReward: 100, condition: JSON.stringify({ type: "helpful_votes", threshold: 25 }) },
  { slug: "perfect-score", name: "Perfectionist", description: "Submit a perfect-score review.", iconEmoji: "✨", category: "QUALITY", rarity: "EPIC", xpReward: 200, condition: JSON.stringify({ type: "perfect_review", threshold: 1 }) },
  { slug: "domain-expert-cs", name: "CS Domain Expert", description: "Complete 20 CS reviews.", iconEmoji: "💻", category: "DOMAIN", rarity: "RARE", xpReward: 200, condition: JSON.stringify({ type: "domain_reviews", domain: "Computer Science", threshold: 20 }) },
  { slug: "domain-expert-bio", name: "Bio Domain Expert", description: "Complete 20 Biology reviews.", iconEmoji: "🧬", category: "DOMAIN", rarity: "RARE", xpReward: 200, condition: JSON.stringify({ type: "domain_reviews", domain: "Biology", threshold: 20 }) },
  { slug: "night-owl", name: "Night Owl", description: "Review between 2–5am.", iconEmoji: "🦉", category: "SPECIAL", rarity: "UNCOMMON", xpReward: 50, condition: JSON.stringify({ type: "review_time_range", startHour: 2, endHour: 5 }) },
  { slug: "scholar-level", name: "Scholar", description: "Reach level 2.", iconEmoji: "🎓", category: "MILESTONE", rarity: "COMMON", xpReward: 100, condition: JSON.stringify({ type: "level_reached", level: 2 }) },
  { slug: "expert-level", name: "Expert", description: "Reach level 4.", iconEmoji: "🧠", category: "MILESTONE", rarity: "RARE", xpReward: 300, condition: JSON.stringify({ type: "level_reached", level: 4 }) },
  { slug: "luminary", name: "Luminary", description: "Reach level 6.", iconEmoji: "🌟", category: "RARE", rarity: "LEGENDARY", xpReward: 2000, condition: JSON.stringify({ type: "level_reached", level: 6 }) },
  { slug: "pioneer", name: "Pioneer", description: "Be among the first 100 registrants.", iconEmoji: "🚀", category: "SPECIAL", rarity: "EPIC", xpReward: 500, condition: JSON.stringify({ type: "registration_order", threshold: 100 }) },
  { slug: "fast-reviewer", name: "Lightning", description: "Review within 2 hours.", iconEmoji: "⚡", category: "SPEED", rarity: "UNCOMMON", xpReward: 75, condition: JSON.stringify({ type: "review_within_hours", threshold: 2 }) },
  { slug: "on-time", name: "Reliable", description: "Submit 10 reviews before deadline.", iconEmoji: "⏱️", category: "SPEED", rarity: "COMMON", xpReward: 50, condition: JSON.stringify({ type: "reviews_before_deadline", threshold: 10 }) },
  { slug: "top-weekly", name: "Weekly Champion", description: "Awarded by admin (weekly).", iconEmoji: "🏆", category: "SPECIAL", rarity: "EPIC", xpReward: 300, condition: JSON.stringify({ type: "admin_awarded", slug: "top-weekly" }) },
  { slug: "tipper", name: "Generous", description: "Send 5 tips.", iconEmoji: "💛", category: "SOCIAL", rarity: "UNCOMMON", xpReward: 50, condition: JSON.stringify({ type: "tips_sent", threshold: 5 }) },
  { slug: "earning-reviewer", name: "Side Hustler", description: "Receive 10 tips.", iconEmoji: "💰", category: "SPECIAL", rarity: "RARE", xpReward: 100, condition: JSON.stringify({ type: "tips_received_count", threshold: 10 }) },
  { slug: "detailed-reviewer", name: "Thorough", description: "Average 300+ words per review.", iconEmoji: "📝", category: "QUALITY", rarity: "UNCOMMON", xpReward: 75, condition: JSON.stringify({ type: "avg_review_words", threshold: 300 }) },
  { slug: "verified-expert", name: "Verified Expert", description: "Reviewer verified.", iconEmoji: "✅", category: "SPECIAL", rarity: "RARE", xpReward: 200, condition: JSON.stringify({ type: "reviewer_verified", threshold: 1 }) },
  { slug: "mentor", name: "Mentor", description: "Help 5 revision cycles.", iconEmoji: "🧭", category: "SOCIAL", rarity: "EPIC", xpReward: 400, condition: JSON.stringify({ type: "revision_cycles_helped", threshold: 5 }) },
]

async function seedBadges() {
  for (const b of BADGES) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        description: b.description,
        iconEmoji: b.iconEmoji,
        category: b.category,
        rarity: b.rarity,
        xpReward: b.xpReward,
        condition: b.condition,
        isActive: true,
      } as any,
      create: {
        slug: b.slug,
        name: b.name,
        description: b.description,
        iconEmoji: b.iconEmoji,
        category: b.category,
        rarity: b.rarity,
        xpReward: b.xpReward,
        condition: b.condition,
        isActive: true,
      } as any,
    })
  }
}

async function createUser(params: {
  email: string
  name: string
  role: Role
  password: string
  institution?: string
  isVerified?: boolean
  xp?: number
  level?: number
}) {
  const hashed = await bcrypt.hash(params.password, 12)
  return prisma.user.upsert({
    where: { email: params.email },
    update: {
      name: params.name,
      role: params.role,
      password: hashed,
      institution: params.institution,
      isVerified: params.isVerified ?? false,
      xp: params.xp ?? 0,
      level: params.level ?? 1,
    },
    create: {
      email: params.email,
      name: params.name,
      role: params.role,
      password: hashed,
      institution: params.institution,
      isVerified: params.isVerified ?? false,
      xp: params.xp ?? 0,
      level: params.level ?? 1,
      emailVerified: new Date(),
    },
  })
}

async function seedUsers() {
  const admin1 = await createUser({ email: 'admin1@scholarforge.dev', name: 'Admin One', role: Role.ADMIN, password: 'admin123', isVerified: true })
  const admin2 = await createUser({ email: 'admin2@scholarforge.dev', name: 'Admin Two', role: Role.ADMIN, password: 'admin123', isVerified: true })
  const admin3 = await createUser({ email: 'admin3@scholarforge.dev', name: 'Admin Three', role: Role.ADMIN, password: 'admin123', isVerified: true })

  const reviewers = [
    { email: 'amara@mit.edu', name: 'Dr. Amara Osei', institution: 'MIT', xp: 2340, level: 4, domains: ['Computer Science', 'Biology'] },
    { email: 'lena@ethz.ch', name: 'Prof. Lena Fischer', institution: 'ETH Zürich', xp: 3800, level: 5, domains: ['Physics', 'Mathematics'] },
    { email: 'ravi@iit.edu', name: 'Dr. Ravi Sharma', institution: 'IIT', xp: 1450, level: 3, domains: ['Computer Science', 'Engineering'] },
    { email: 'sofia@stanford.edu', name: 'Dr. Sofia Reyes', institution: 'Stanford', xp: 780, level: 2, domains: ['Medicine', 'Biology'] },
    { email: 'james@berkeley.edu', name: 'James Chen', institution: 'UC Berkeley', xp: 210, level: 1, domains: ['Computer Science'] },
  ]

  const reviewerUsers = []
  for (const r of reviewers) {
    const u = await createUser({
      email: r.email,
      name: r.name,
      role: Role.REVIEWER,
      password: 'password123',
      institution: r.institution,
      isVerified: true,
      xp: r.xp,
      level: r.level,
    })
    reviewerUsers.push(u)
    await prisma.reviewerProfile.upsert({
      where: { userId: u.id },
      update: {
        degreeDocUrl: '/uploads/degree.pdf',
        degreeType: 'PhD',
        position: 'Researcher',
        institution: r.institution,
        domains: JSON.stringify(r.domains),
        proficiency: JSON.stringify(Object.fromEntries(r.domains.map((d) => [d, 4]))),
        isAvailable: true,
        maxActiveReviews: 3,
        verificationStatus: VerificationStatus.APPROVED,
        verifiedAt: new Date(),
        verifiedBy: admin1.id,
        bio: 'Peer reviewer and researcher focused on rigorous methodology and reproducibility.',
        linkedinUrl: 'https://linkedin.com',
      },
      create: {
        userId: u.id,
        degreeDocUrl: '/uploads/degree.pdf',
        degreeType: 'PhD',
        position: 'Researcher',
        institution: r.institution,
        domains: JSON.stringify(r.domains),
        proficiency: JSON.stringify(Object.fromEntries(r.domains.map((d) => [d, 4]))),
        isAvailable: true,
        maxActiveReviews: 3,
        verificationStatus: VerificationStatus.APPROVED,
        verifiedAt: new Date(),
        verifiedBy: admin1.id,
        bio: 'Peer reviewer and researcher focused on rigorous methodology and reproducibility.',
        linkedinUrl: 'https://linkedin.com',
      },
    })
  }

  const authors = [
    { email: 'author1@uni.edu', name: 'Avery Quinn', institution: 'University of Arcadia' },
    { email: 'author2@uni.edu', name: 'Morgan Lee', institution: 'Northbridge University' },
    { email: 'author3@uni.edu', name: 'Jordan Patel', institution: 'Helios Institute' },
  ]

  const authorUsers = []
  for (const a of authors) {
    const u = await createUser({
      email: a.email,
      name: a.name,
      role: Role.AUTHOR,
      password: 'password123',
      institution: a.institution,
      isVerified: true,
    })
    authorUsers.push(u)
  }

  return { admins: [admin1, admin2, admin3], reviewers: reviewerUsers, authors: authorUsers }
}

async function seedPapersAndReviews(ctx: { reviewers: any[]; authors: any[] }) {
  const [r1, r2, r3, r4, r5] = ctx.reviewers
  const [a1, a2, a3] = ctx.authors

  const mkPaper = async (authorId: string, title: string, status: PaperStatus, domain: string) => {
    return prisma.paper.create({
      data: {
        authorId,
        title,
        abstract:
          'This work investigates a novel approach with rigorous evaluation and clear ablation studies. We discuss limitations and future work.',
        fileUrl: 'https://example.com/paper.pdf',
        fileName: 'paper.pdf',
        fileSize: 1024 * 1024,
        domain,
        tags: JSON.stringify(['peer-review', 'open-science']),
        status,
        aiSuggestedTags: JSON.stringify(['methodology', 'evaluation', 'reproducibility']),
        reviewTimeline: 'standard',
        preferredReviewers: 2,
        isAnonymous: false,
        submittedAt: status !== PaperStatus.DRAFT ? nowMinusDays(10) : null,
        publishedAt: status === PaperStatus.PUBLISHED ? nowMinusDays(3) : null,
      },
    })
  }

  // Author 1: 3 papers (1 published, 1 under review, 1 submitted)
  const p1 = await mkPaper(a1.id, 'Attention Mechanisms in Multi-Modal Learning', PaperStatus.PUBLISHED, 'Computer Science')
  const p2 = await mkPaper(a1.id, 'Federated Learning for Privacy-Preserving NLP', PaperStatus.UNDER_REVIEW, 'Computer Science')
  const p3 = await mkPaper(a1.id, 'Causal Models for Biological Pathways', PaperStatus.SUBMITTED, 'Biology')

  // Author 2: 2 published
  const p4 = await mkPaper(a2.id, 'Quantum Error Mitigation in Noisy Systems', PaperStatus.PUBLISHED, 'Physics')
  const p5 = await mkPaper(a2.id, 'Topology-Informed Optimization Methods', PaperStatus.PUBLISHED, 'Mathematics')

  // Author 3: 1 revision requested
  const p6 = await mkPaper(a3.id, 'Clinical Decision Support with Robust Uncertainty', PaperStatus.REVISION_REQUESTED, 'Medicine')

  const longText = (topic: string) =>
    `Summary: ${topic} shows strong motivation and clear framing. The evaluation is mostly convincing, though some baselines could be expanded.\n\nStrengths: Clear writing, solid experimental design, thoughtful discussion.\n\nWeaknesses: Missing comparison to two recent baselines; reproducibility artifacts should be improved.\n\nSuggestions: Add an ablation on the regularization term and include confidence intervals across seeds.`

  const mkReview = async (paperId: string, reviewerId: string, rec: ReviewRecommendation) => {
    const clarity = 8, meth = 8, nov = 7, rep = 7, imp = 8
    const overall = (clarity + meth + nov + rep + imp) / 5
    return prisma.review.create({
      data: {
        paperId,
        reviewerId,
        summary: longText('the submission'),
        strengths: longText('strengths'),
        weaknesses: longText('weaknesses'),
        clarityScore: clarity,
        methodologyScore: meth,
        noveltyScore: nov,
        reproducibilityScore: rep,
        impactScore: imp,
        overallScore: overall,
        recommendation: rec,
        claimedAt: nowMinusDays(7),
        submittedAt: nowMinusDays(6),
        reviewDurationMinutes: 180,
        xpAwarded: 50,
      },
    })
  }

  // Reviews for published papers
  await mkReview(p1.id, r1.id, ReviewRecommendation.MINOR_REVISION)
  await mkReview(p1.id, r3.id, ReviewRecommendation.ACCEPT)
  await mkReview(p4.id, r2.id, ReviewRecommendation.ACCEPT)
  await mkReview(p5.id, r2.id, ReviewRecommendation.MINOR_REVISION)

  // XP logs roughly matching totals (simple split)
  for (const u of ctx.reviewers) {
    const chunks = 5
    const per = Math.floor(u.xp / chunks)
    for (let i = 0; i < chunks; i++) {
      await prisma.xPLog.create({
        data: {
          userId: u.id,
          amount: per,
          reason: 'seed_xp',
          metadata: JSON.stringify({ i }),
          createdAt: nowMinusDays(30 - i * 3),
        },
      })
    }
  }

  // Notifications
  const users = [...ctx.reviewers, ...ctx.authors]
  for (const u of users) {
    await prisma.notification.create({
      data: {
        userId: u.id,
        type: 'ADMIN_MESSAGE' as any,
        title: 'Welcome to ScholarForge',
        message: 'Your account has been initialized for local development.',
        isRead: false,
      } as any,
    })
    await prisma.notification.create({
      data: {
        userId: u.id,
        type: 'XP_EARNED' as any,
        title: 'XP Awarded',
        message: 'You earned XP for your activity.',
        isRead: true,
      } as any,
    })
  }

  // Sample tip (PENDING)
  await prisma.tip.create({
    data: {
      senderId: a1.id,
      receiverId: r1.id,
      paperId: p1.id,
      amountCents: 500,
      currency: 'usd',
      stripePaymentId: 'pi_seed_1',
      status: TipStatus.PENDING,
      message: 'Thanks for the thoughtful feedback!',
    },
  })
}

async function awardSomeBadges(reviewers: any[]) {
  const firstReview = await prisma.badge.findUnique({ where: { slug: 'first-review' } })
  if (!firstReview) return
  for (const u of reviewers) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: u.id, badgeId: firstReview.id } },
      update: {},
      create: { userId: u.id, badgeId: firstReview.id, awardNote: 'Seeded badge' },
    })
  }
}

async function main() {
  await upsertSystemSettings()
  await seedBadges()
  const { reviewers, authors } = await seedUsers()
  await seedPapersAndReviews({ reviewers, authors })
  await awardSomeBadges(reviewers)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

