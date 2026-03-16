import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import { addEmailJob } from '@/lib/queue'
import { successResponse, errorResponse } from '../../_helpers'

function makeToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return errorResponse('Validation failed', 400)

    const { name, email, password, role, institution, position, domains, degreeDocUrl, degreeType } = parsed.data as any
    const normalizedEmail = String(email).trim().toLowerCase()

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) return errorResponse('Email already registered', 409)

    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashed,
        role,
        institution: institution ?? null,
        isVerified: role === 'AUTHOR',
      } as any,
      select: { id: true, name: true, email: true, role: true },
    })

    if (role === 'REVIEWER') {
      await prisma.reviewerProfile.create({
        data: {
          userId: user.id,
          degreeDocUrl,
          degreeType,
          position,
          institution: institution ?? '',
          domains: JSON.stringify(domains ?? []),
          proficiency: JSON.stringify(Object.fromEntries((domains ?? []).map((d: string) => [d, 3]))),
          verificationStatus: 'PENDING' as any,
        } as any,
      })
    }

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'ADMIN_MESSAGE' as any,
        title: 'Welcome to ScholarForge',
        message: 'Welcome to ScholarForge. Your account is ready.',
        link: '/dashboard',
        isRead: false,
      } as any,
    })

    // Email verification token (stored in VerificationToken)
    const token = makeToken(24)
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/verify-email?token=${token}`

    await addEmailJob({ name: 'welcome', data: { name: user.name, email: user.email, role: user.role } })
    await addEmailJob({ name: 'emailVerification', data: { user: { name: user.name, email: user.email }, verificationUrl } })

    return successResponse({ user }, 201)
  } catch (e: any) {
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

