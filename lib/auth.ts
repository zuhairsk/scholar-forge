import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'

import { prisma } from './prisma'

type Role = 'AUTHOR' | 'REVIEWER' | 'ADMIN'

function assertEnv(name: string): string | undefined {
  const v = process.env[name]
  return v && v.length > 0 ? v : undefined
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === 'string' ? credentials.email.trim().toLowerCase() : ''
        const password = typeof credentials?.password === 'string' ? credentials.password : ''

        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null
        if (user.isSuspended) throw new Error('Account suspended')
        if (!user.password) return null

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl ?? undefined,
        }
      },
    }),
    Google({
      clientId: assertEnv('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: assertEnv('GOOGLE_CLIENT_SECRET') ?? '',
      // If unset, NextAuth will still initialize but Google sign-in will fail at runtime.
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false
      const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
      if (dbUser?.isSuspended) {
        // NextAuth will redirect to /login?error=AccessDenied
        return false
      }
      return true
    },
    async jwt({ token, user }) {
      // Initial sign-in: `user` is present
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
        if (dbUser) {
          token.sub = dbUser.id
          token.role = dbUser.role as Role
          token.xp = dbUser.xp
          token.level = dbUser.level
          token.isVerified = dbUser.isVerified
          token.isSuspended = dbUser.isSuspended
          token.avatarUrl = dbUser.avatarUrl ?? undefined
        }
      }
      return token
    },
    async session({ session, token }) {
      // NextAuth always provides `session.user`, but keep this defensive and satisfy our augmented type.
      if (!session.user) session.user = {} as any

      session.user.id = typeof token.sub === 'string' ? token.sub : ''
      session.user.role = (token.role as Role) ?? 'AUTHOR'
      session.user.xp = typeof token.xp === 'number' ? token.xp : 0
      session.user.level = typeof token.level === 'number' ? token.level : 1
      session.user.isVerified = Boolean(token.isVerified)
      session.user.isSuspended = Boolean(token.isSuspended)
      session.user.avatarUrl = typeof token.avatarUrl === 'string' ? token.avatarUrl : null

      // Always include these too (requested)
      session.user.name = session.user.name ?? null
      session.user.email = session.user.email ?? null

      return session
    },
  },
  events: {
    async createUser({ user }) {
      try {
        await prisma.notification.create({
          data: {
            userId: user.id!,
            type: 'ADMIN_MESSAGE' as any,
            title: 'Welcome to ScholarForge',
            message: 'Your account has been created. Welcome to the forge.',
            link: '/dashboard',
            isRead: false,
          } as any,
        })
      } catch (e) {
        console.error('createUser event failed:', e)
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

