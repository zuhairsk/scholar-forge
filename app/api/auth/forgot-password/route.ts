import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { addEmailJob } from '@/lib/queue'
import { successResponse } from '../../_helpers'

const schema = z.object({ email: z.string().email() })

function makeToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

export async function POST(req: NextRequest) {
  // Always return success (avoid user enumeration)
  try {
    const body = await req.json().catch(() => null)
    const parsed = schema.safeParse(body)
    if (!parsed.success) return successResponse({ success: true })

    const email = parsed.data.email.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return successResponse({ success: true })

    const token = makeToken(24)
    await prisma.verificationToken.create({
      data: {
        identifier: `password-reset:${email}`,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/reset-password?token=${token}`
    await addEmailJob({ name: 'passwordReset', data: { user: { name: user.name, email: user.email }, resetUrl } })

    return successResponse({ success: true })
  } catch {
    return successResponse({ success: true })
  }
}

