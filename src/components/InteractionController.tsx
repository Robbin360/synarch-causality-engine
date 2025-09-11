'use client'

import { Html } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useMode } from '@/components/ModeContext'

function InteractionController() {
  const { mode, setMode } = useMode()
const [showModeButtons, setShowModeButtons] = useState(false)

// Show mode buttons after intro
useEffect(() => {
  const timer = setTimeout(() => setShowModeButtons(true), 1200)
  return () => clearTimeout(timer)
}, [])

if (!showModeButtons) return null

 return (
  <>
    <Html position={[-8, 4, 0]} center>
    <div
    style={{
        padding: '20px',
        background: mode === 'NOEMA' ? 'rgba(34, 255, 8, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        border: mode === 'NOEMA' ? '2px solid #22FF08' : '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '10px',
           color: mode === 'NOEMA' ? '#22FF08' : '#ffffff',
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

<Html position={[8, 4, 0]} center>
<div
style={{
padding: '20px',
background: mode === 'FULCRUM' ? 'rgba(220, 20, 60, 0.2)' : 'rgba(255, 255, 255, 0.1)',
border: mode === 'FULCRUM' ? '2px solid #DC143C' : '2px solid rgba(255, 255, 255, 0.3)',
borderRadius: '10px',
color: mode === 'FULCRUM' ? '#DC143C' : '#ffffff',
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

<Html position={[0, -6, 0]} center>
<div
style={{
padding: '15px 25px',
background: 'rgba(0, 0, 0, 0.8)',
border: `2px solid ${mode === 'NOEMA' ? '#22FF08' : mode === 'FULCRUM' ? '#DC143C' : '#0066FF'}`,
borderRadius: '25px',
color: mode === 'NOEMA' ? '#22FF08' : mode === 'FULCRUM' ? '#DC143C' : '#0066FF',
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
{mode === 'IDLE' ? 'Causality Engine' : `Mode: ${mode}`}
</div>
</Html>
</>
)
}

export default InteractionController