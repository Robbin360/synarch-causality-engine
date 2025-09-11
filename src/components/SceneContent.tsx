'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Html, Points, PointMaterial, OrbitControls } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

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
  const points = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const particleCount = 10000
  
  // Generate particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10
      positions[i + 1] = (Math.random() - 0.5) * 10
      positions[i + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  // Animate particles
  useFrame(({ clock }) => {
    if (!points.current) return
    
    const positions = points.current.geometry.attributes.position.array as Float32Array
    const time = clock.getElapsedTime()
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const i3 = i / 3
      positions[i] += Math.sin(time * 0.1 + i3 * 0.001) * 0.005
      positions[i + 1] += Math.cos(time * 0.15 + i3 * 0.001) * 0.005
      positions[i + 2] += Math.sin(time * 0.2 + i3 * 0.001) * 0.005
    }
    
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <Points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          color="#0066ff"
          size={0.02}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
        />
      </Points>
      
      <Narrative />
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  )
}
