'use client'

import { usePathname } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''

  const role: 'author' | 'reviewer' | 'admin' = pathname.startsWith('/dashboard/author')
    ? 'author'
    : pathname.startsWith('/admin')
      ? 'admin'
      : 'reviewer'

  return <AppLayout role={role}>{children}</AppLayout>
}

