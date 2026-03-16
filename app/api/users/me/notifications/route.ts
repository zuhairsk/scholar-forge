import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, successResponse, errorResponse, getPagination } from '../../../_helpers'

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req)
    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const { skip, take } = getPagination(searchParams)

    const where = { userId: session.user.id, ...(unreadOnly ? { isRead: false } : {}) }

    const [total, data] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ])

    return successResponse({ data, total })
  } catch (e: any) {
    if (e?.status) return e
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

