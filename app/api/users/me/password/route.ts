import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { requireAuth, successResponse, errorResponse, validateBody } from '../../../_helpers'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth(req)
    const body = await validateBody(req, schema)

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || !user.password) return errorResponse('Invalid credentials', 400)

    const ok = await bcrypt.compare(body.currentPassword, user.password)
    if (!ok) return errorResponse('Current password is incorrect', 400)

    const hashed = await bcrypt.hash(body.newPassword, 12)
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

    return successResponse({ success: true })
  } catch (e: any) {
    if (e?.status) return e
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

