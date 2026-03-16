'use client'

import { usePathname } from 'next/navigation'
import {
  AuroraBg,
  ConstellationBg,
  InkDropBg,
  PaperCosmosBg,
  StarFieldBg,
} from '@/components/three/Backgrounds'

export function LiveBackground() {
  const pathname = usePathname() ?? ''

  if (pathname === '/') return <ConstellationBg />
  if (pathname.startsWith('/dashboard/author')) return <PaperCosmosBg />
  if (pathname.startsWith('/dashboard/reviewer/active/')) return <InkDropBg />
  if (pathname.startsWith('/dashboard/reviewer')) return <AuroraBg />
  if (pathname.startsWith('/leaderboard')) return <StarFieldBg />

  return null
}

