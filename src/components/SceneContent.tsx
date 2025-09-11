'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Html, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { ParticleEngine } from './ParticleEngine'
import { useModeStore } from '../stores/modeStore'
import InteractionController from './InteractionController'

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
  const { viewport } = useThree()
  const { currentMode, mousePosition, setMousePosition } = useModeStore()

  // Track mouse position for particle interaction
  useFrame((state) => {
    if (state.mouse) {
      setMousePosition([state.mouse.x, state.mouse.y])
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <ParticleEngine 
        mode={currentMode}
        mousePosition={mousePosition}
      />
      
      <InteractionController />
      <Narrative />
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  )
}
