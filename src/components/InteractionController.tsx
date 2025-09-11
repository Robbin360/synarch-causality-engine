'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useModeStore } from '../stores/modeStore'

function InteractionController() {
  const { mouse, camera, viewport } = useThree()
  const { currentMode, setMode, setMousePosition } = useModeStore()
  const [showModeButtons, setShowModeButtons] = useState(false)
  
  // Track mouse position and update store
  useFrame((state) => {
    if (state.mouse) {
      setMousePosition([state.mouse.x, state.mouse.y])
    }
  })

  // Show mode buttons after Big Bang animation (3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModeButtons(true)
    }, 3500)
    
    return () => clearTimeout(timer)
  }, [])

  // Mode trigger areas
  const ModeButtons = () => {
    if (!showModeButtons) return null

    return (
      <>
        {/* NOEMA trigger area */}
        <Html position={[-8, 4, 0]} center>
          <div
            style={{
              padding: '20px',
              background: currentMode === 'NOEMA' ? 'rgba(34, 255, 8, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: currentMode === 'NOEMA' ? '2px solid #22FF08' : '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              color: currentMode === 'NOEMA' ? '#22FF08' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              fontFamily: 'monospace',
              fontSize: '14px',
              textAlign: 'center',
              minWidth: '120px'
            }}
            onPointerEnter={() => setMode('NOEMA')}
            onPointerLeave={() => setMode('IDLE')}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>NOEMA</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Grid Scanning</div>
          </div>
        </Html>

        {/* FULCRUM trigger area */}
        <Html position={[8, 4, 0]} center>
          <div
            style={{
              padding: '20px',
              background: currentMode === 'FULCRUM' ? 'rgba(220, 20, 60, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: currentMode === 'FULCRUM' ? '2px solid #DC143C' : '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              color: currentMode === 'FULCRUM' ? '#DC143C' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              fontFamily: 'monospace',
              fontSize: '14px',
              textAlign: 'center',
              minWidth: '120px'
            }}
            onPointerEnter={() => setMode('FULCRUM')}
            onPointerLeave={() => setMode('IDLE')}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>FULCRUM</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Shockwave</div>
          </div>
        </Html>

        {/* Mode indicator */}
        <Html position={[0, -6, 0]} center>
          <div
            style={{
              padding: '15px 25px',
              background: 'rgba(0, 0, 0, 0.8)',
              border: `2px solid ${
                currentMode === 'NOEMA' ? '#22FF08' : 
                currentMode === 'FULCRUM' ? '#DC143C' : '#0066FF'
              }`,
              borderRadius: '25px',
              color: currentMode === 'NOEMA' ? '#22FF08' : 
                     currentMode === 'FULCRUM' ? '#DC143C' : '#0066FF',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}
          >
            {currentMode === 'IDLE' ? 'Causality Engine' : `Mode: ${currentMode}`}
          </div>
        </Html>
      </>
    )
  }

  return <ModeButtons />
}

export default InteractionController