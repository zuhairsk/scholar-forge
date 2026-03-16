import { NextRequest } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '../../_helpers'

const schema = z.object({
  token: z.string().min(10),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return errorResponse('Validation failed', 400)

    const vt = await prisma.verificationToken.findUnique({ where: { token: parsed.data.token } })
    if (!vt) return errorResponse('Invalid token', 400)
    if (!vt.identifier.startsWith('password-reset:')) return errorResponse('Invalid token', 400)
    if (vt.expires.getTime() < Date.now()) return errorResponse('Token expired', 400)

    const email = vt.identifier.replace('password-reset:', '')
    const hashed = await bcrypt.hash(parsed.data.password, 12)

    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    })

    await prisma.verificationToken.delete({ where: { token: vt.token } })

    return successResponse({ success: true })
  } catch (e: any) {
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

