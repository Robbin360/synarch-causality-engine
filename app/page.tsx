'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const CausalityEngine = dynamic(
  () => import('../src/components/CausalityEngine').then((mod) => mod.default || mod.CausalityEngine),
  {
    ssr: false,
    loading: () => <div style={{ backgroundColor: 'black', width: '100vw', height: '100vh' }} />,
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
