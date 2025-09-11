'use client'

import { useFrame } from '@react-three/fiber'
import { useScroll, Html } from '@react-three/drei'
import { useRef } from 'react'

function Narrative() {
  const scroll = useScroll()
  const textRef = useRef<HTMLDivElement>(null!)

  useFrame(() => {
    const opacity = scroll.range(1 / 5, 2 / 5)
    if (textRef.current) {
      textRef.current.style.opacity = `${opacity}`
    }
  })

  return (
    <Html position={[0, 0, 0]}>
      <div ref={textRef} style={{ color: 'white', width: '50vw', textAlign: 'center', transition: 'opacity 0.2s' }}>
        <h2>THESIS</h2>
        <p>1. El Sistema como Entidad...</p>
      </div>
    </Html>
  )
}

export function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      {/* Aquí se añadirán el resto de componentes 3D como ParticleEngine */}
      <Narrative />
    </>
  )
}
