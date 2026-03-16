import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, successResponse, errorResponse } from '../../_helpers'

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req)
    const count = await prisma.notification.count({ where: { userId: session.user.id, isRead: false } })
    return successResponse({ count })
  } catch (e: any) {
    if (e?.status) return e
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

