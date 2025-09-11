'use client'

import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { SceneContent } from './SceneContent'

export function CausalityEngine() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
      <color attach="background" args={['#000000']} />
      <ScrollControls pages={5} damping={0.1}>
        <SceneContent />
      </ScrollControls>
    </Canvas>
  )
}
