import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '../../_helpers'
import { z } from 'zod'

const schema = z.object({ token: z.string().min(10) })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return errorResponse('Validation failed', 400)

    const vt = await prisma.verificationToken.findUnique({ where: { token: parsed.data.token } })
    if (!vt) return errorResponse('Invalid token', 400)
    if (vt.expires.getTime() < Date.now()) return errorResponse('Token expired', 400)

    await prisma.user.update({
      where: { email: vt.identifier },
      data: { emailVerified: new Date() },
    })

    await prisma.verificationToken.delete({ where: { token: vt.token } })

    return successResponse({ success: true })
  } catch (e: any) {
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

