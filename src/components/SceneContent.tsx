'use client'

import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { ParticleEngine } from './ParticleEngine'
import { useMode } from '@/components/ModeContext'

export function SceneContent() {
  const { mode } = useMode()
  const mouseRef = useRef<[number, number]>([0, 0])

  // Track mouse position for particle interaction
  useFrame((state) => {
    if (state.mouse) {
      mouseRef.current = [state.mouse.x, state.mouse.y]
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <ParticleEngine 
        mode={mode}
        mousePosition={mouseRef.current}
      />
      
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  )
}
