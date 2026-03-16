import Link from 'next/link'
import { useParams as useNextParams, usePathname, useRouter } from 'next/navigation'
import type { ComponentType, PropsWithChildren, ReactNode } from 'react'

/**
 * Minimal `wouter` shim for the migration.
 * Keeps existing components/pages unchanged while routing is handled by Next.js App Router.
 */

export function useLocation(): [string, (to: string) => void] {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  return [pathname, (to: string) => router.push(to)]
}

export function useParams<TParams extends Record<string, string | string[]> = Record<string, string | string[]>>() {
  return useNextParams() as TParams
}

export function useRoute<TParams extends Record<string, string | string[]> = Record<string, string | string[]>>(
  _pattern: string,
): [boolean, TParams | null] {
  // Next's file-based routing determines the match; we expose params for compatibility.
  const params = useParams<TParams>()
  return [true, params ?? null]
}

export function Router({ children }: { children: ReactNode; base?: string }) {
  return <>{children}</>
}

export function Switch({ children }: PropsWithChildren) {
  return <>{children}</>
}

export function Route(_props: { path?: string; component?: ComponentType<any> }) {
  // In Next.js, file-based routing decides what renders.
  return null
}

export { Link }

