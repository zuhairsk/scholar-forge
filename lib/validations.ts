import { z } from 'zod'

const ROLE = z.enum(['AUTHOR', 'REVIEWER'])

export const DOMAIN_ENUM = z.enum([
  'Computer Science',
  'Biology',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Medicine',
  'Economics',
  'Psychology',
  'Engineering',
  'Environmental Science',
])

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    role: ROLE,
    institution: z.string().optional(),
    position: z.string().optional(),
    domains: z.array(DOMAIN_ENUM).optional(),
    degreeDocUrl: z.string().url('degreeDocUrl must be a valid URL').optional(),
    degreeType: z.string().min(2, 'degreeType is required').optional(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Passwords do not match', path: ['confirmPassword'] })
    }
    if (val.role === 'REVIEWER') {
      if (!val.position || val.position.trim().length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Position is required for reviewers', path: ['position'] })
      }
      if (!val.domains || val.domains.length < 1) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select at least one domain', path: ['domains'] })
      }
      if (!val.degreeDocUrl) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'degreeDocUrl is required for reviewers', path: ['degreeDocUrl'] })
      }
      if (!val.degreeType) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'degreeType is required for reviewers', path: ['degreeType'] })
      }
    }
  })

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const paperSubmitSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title must be at most 200 characters'),
  abstract: z
    .string()
    .min(50, 'Abstract must be at least 50 characters')
    .max(2000, 'Abstract must be at most 2000 characters'),
  fileUrl: z.string().url('fileUrl must be a valid URL'),
  fileName: z.string().min(1, 'fileName is required'),
  fileSize: z.number().int('fileSize must be an integer').max(52428800, 'fileSize must be <= 50MB'),
  domain: DOMAIN_ENUM,
  tags: z.array(z.string().min(1)).min(1, 'Add at least one tag').max(8, 'Max 8 tags'),
  preferredReviewers: z.number().int().min(1).max(3),
  reviewTimeline: z.enum(['standard', 'express', 'flexible']),
  isAnonymous: z.boolean(),
  coAuthors: z.array(z.string().email('Co-author must be a valid email')).optional(),
})

export const reviewRecommendationSchema = z.enum(['ACCEPT', 'MINOR_REVISION', 'MAJOR_REVISION', 'REJECT'])

export const reviewSubmitSchema = z.object({
  summary: z.string().min(100, 'Summary must be at least 100 characters'),
  strengths: z.string().min(50, 'Strengths must be at least 50 characters'),
  weaknesses: z.string().min(50, 'Weaknesses must be at least 50 characters'),
  clarityScore: z.number().int().min(1).max(10),
  methodologyScore: z.number().int().min(1).max(10),
  noveltyScore: z.number().int().min(1).max(10),
  reproducibilityScore: z.number().int().min(1).max(10),
  impactScore: z.number().int().min(1).max(10),
  recommendation: reviewRecommendationSchema,
  privateNote: z.string().max(2000).optional(),
  publicComment: z.string().max(2000).optional(),
  isAnonymous: z.boolean().default(false),
})

export const reviewDraftSchema = reviewSubmitSchema.partial()

export const tipSchema = z.object({
  receiverId: z.string().cuid('receiverId must be a valid cuid'),
  amountCents: z.number().int().min(100, 'Minimum tip is $1.00').max(100000, 'Maximum tip is $1000.00'),
  paperId: z.string().cuid('paperId must be a valid cuid').optional(),
  reviewId: z.string().cuid('reviewId must be a valid cuid').optional(),
  message: z.string().max(200, 'Message must be at most 200 characters').optional(),
})

const orcidRegex = /^(\d{4}-){3}\d{3}(\d|X)$/

export const userUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  institution: z.string().optional(),
  orcid: z.string().regex(orcidRegex, 'ORCID must look like 0000-0000-0000-0000').optional(),
  website: z.string().url('website must be a valid URL').optional(),
  avatarUrl: z.string().url('avatarUrl must be a valid URL').optional(),
})

export const verifyReviewerSchema = z
  .object({
    action: z.enum(['approve', 'reject']),
    note: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.action === 'reject' && (!val.note || val.note.trim().length === 0)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'note is required when rejecting', path: ['note'] })
    }
  })

export const adminAwardSchema = z.object({
  amount: z.number().int('amount must be an integer'),
  reason: z.string().min(5, 'reason must be at least 5 characters'),
})

export const searchSchema = z.object({
  q: z.string().min(2, 'q must be at least 2 characters').max(100, 'q must be at most 100 characters'),
  type: z.enum(['papers', 'users', 'all']).default('all'),
  domain: DOMAIN_ENUM.optional(),
  status: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PaperSubmitInput = z.infer<typeof paperSubmitSchema>
export type ReviewSubmitInput = z.infer<typeof reviewSubmitSchema>
export type ReviewDraftInput = z.infer<typeof reviewDraftSchema>
export type TipInput = z.infer<typeof tipSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type VerifyReviewerInput = z.infer<typeof verifyReviewerSchema>
export type AdminAwardInput = z.infer<typeof adminAwardSchema>
export type SearchInput = z.infer<typeof searchSchema>

