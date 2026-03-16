import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ZodSchema } from 'zod'
import { paginateQuery } from '@/lib/utils'

export async function requireAuth(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user) {
    throw new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return session
}

export async function requireRole(req: NextRequest, role: 'ADMIN' | 'REVIEWER' | 'AUTHOR') {
  const session = await requireAuth(req)
  if (session.user.role !== role) {
    throw new NextResponse(JSON.stringify({ success: false, error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return session
}

export async function validateBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  const json = await req.json().catch(() => null)
  if (!json || typeof json !== 'object') {
    throw errorResponse('Invalid JSON body', 400)
  }
  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    const issues = parsed.error.flatten()
    throw new NextResponse(JSON.stringify({ success: false, error: 'Validation failed', details: issues }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return parsed.data
}

export function successResponse(data: unknown, status = 200): NextResponse {
  return new NextResponse(JSON.stringify({ success: true, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function errorResponse(message: string, status = 400): NextResponse {
  return new NextResponse(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function getPagination(searchParams: URLSearchParams): {
  page: number
  limit: number
  skip: number
  take: number
} {
  const page = Number(searchParams.get('page') ?? '1') || 1
  const limit = Number(searchParams.get('limit') ?? '20') || 20
  const { skip, take } = paginateQuery(page, limit)
  return { page, limit: take, skip, take }
}

