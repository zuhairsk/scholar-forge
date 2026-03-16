import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const PUBLIC_PATHS = ['/', '/login', '/register', '/explore', '/leaderboard']

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith('/paper/')) return true
  if (pathname.startsWith('/api/auth/')) return true
  if (pathname === '/api/search') return true
  if (pathname === '/api/leaderboard') return true
  if (pathname === '/api/webhooks/stripe') return true
  // allow unauthenticated GET for /api/papers
  if (pathname === '/api/papers') return true
  if (pathname.startsWith('/api/uploadthing')) return true
  return false
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const session = await auth()

  // Protect all other API routes by default
  if (pathname.startsWith('/api/')) {
    if (!session) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  // Protect dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Protect admin pages
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Protect admin APIs
  if (pathname.startsWith('/api/admin')) {
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ success: false, error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}

