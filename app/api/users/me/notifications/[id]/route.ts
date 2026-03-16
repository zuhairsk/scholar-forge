import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, successResponse, errorResponse } from '../../../../_helpers'

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const session = await requireAuth(req)
    const id = ctx.params.id
    await prisma.notification.update({
      where: { id, userId: session.user.id } as any,
      data: { isRead: true },
    })
    return successResponse({ success: true })
  } catch (e: any) {
    if (e?.status) return e
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

export async function DELETE(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const session = await requireAuth(req)
    const id = ctx.params.id
    await prisma.notification.delete({ where: { id, userId: session.user.id } as any })
    return successResponse({ success: true })
  } catch (e: any) {
    if (e?.status) return e
    return errorResponse(e?.message ?? 'Server error', 500)
  }
}

