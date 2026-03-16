import type { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'AUTHOR' | 'REVIEWER' | 'ADMIN'
      xp: number
      level: number
      isVerified: boolean
      isSuspended: boolean
      avatarUrl: string | null
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role?: 'AUTHOR' | 'REVIEWER' | 'ADMIN'
    xp?: number
    level?: number
    isVerified?: boolean
    isSuspended?: boolean
    avatarUrl?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'AUTHOR' | 'REVIEWER' | 'ADMIN'
    xp?: number
    level?: number
    isVerified?: boolean
    isSuspended?: boolean
    avatarUrl?: string | null
  }
}

