'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useMode } from './ModeContext';

function InteractionController() {
  const { mouse, camera } = useThree();
  const { mode, setMode } = useMode();
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Pass mouse position and mode to shaders (this would be implemented in the actual shader)
  useFrame(() => {
    // This is where we would update shader uniforms in a real implementation
    // For now, we're just tracking the state changes
  });
  
  return null;
}

export default InteractionController;