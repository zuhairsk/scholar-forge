import type { Metadata } from 'next'
import Providers from './providers'
import { CustomCursor } from './_components/CustomCursor'
import { LiveBackground } from './_components/LiveBackground'

import '@/index.css'

export const metadata: Metadata = {
  title: 'ScholarForge',
  description: 'Gamified academic peer review platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <CustomCursor />
          <LiveBackground />
          {children}
        </Providers>
      </body>
    </html>
  )
}

