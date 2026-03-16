import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { requireAuth, successResponse, errorResponse, validateBody } from '../../_helpers'
import { userUpdateSchema } from '@/lib/validations'
import { awardXP, XP_REWARDS } from '@/lib/xp'

function isProfileComplete(u: { bio?: string | null; institution?: string | null; avatarUrl?: string | null; orcid?: string | null; website?: string | null }) {
  return Boolean(u.bio && u.institution && u.avatarUrl)
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { reviewerProfile: true },
    })
    if (!user) return errorResponse('Not found', 404)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = user as any
    return successResponse(safe)
  } catch (e: any) {
    if (e?.status) return e
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth(req)
    const input = await validateBody(req, userUpdateSchema)

    const before = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!before) return errorResponse('Not found', 404)

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: input.name ?? undefined,
        bio: input.bio ?? undefined,
        institution: input.institution ?? undefined,
        orcid: input.orcid ?? undefined,
        website: input.website ?? undefined,
        avatarUrl: input.avatarUrl ?? undefined,
      },
    })

    // award profile completion XP once
    const wasComplete = isProfileComplete(before)
    const nowComplete = isProfileComplete(updated)
    if (!wasComplete && nowComplete) {
      await awardXP(updated.id, XP_REWARDS.PROFILE_COMPLETED, 'profile_completed')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = updated as any
    return successResponse(safe)
  } catch (e: any) {
    if (e?.status) return e
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

