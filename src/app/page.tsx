'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const CausalityEngine = dynamic(
  () => import('@/components/CausalityEngine').then((mod) => mod.CausalityEngine || mod.default),
  {
    ssr: false,
    loading: () => <div style={{ backgroundColor: 'black', width: '100vw', height: '100vh' }}>Loading...</div>,
  }
)

export default function HomePage() {
  return (
    <main style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, background: 'black' }}>
      <Suspense fallback={null}>
        <CausalityEngine />
      </Suspense>
    </main>
  )
}