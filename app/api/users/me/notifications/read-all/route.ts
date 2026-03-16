import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, successResponse, errorResponse } from '../../../../_helpers'

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth(req)
    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    })
    return successResponse({ success: true })
  } catch (e: any) {
    if (e?.status) return e
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

