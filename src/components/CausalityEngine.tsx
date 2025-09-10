'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, PerspectiveCamera, ScrollControls } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import InteractionController from './InteractionController';
import { useMode } from './ModeContext';
import LoadingIndicator from './LoadingIndicator';
import NarrativeController from './NarrativeController';

// Custom shader material for the particle ocean
const ParticleOcean = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 500000;
  const { mode } = useMode();
  
  // Animation state for NOEMA and FULCRUM modes
  const [noemaState, setNoemaState] = useState<'idle' | 'formingGrid' | 'pulse' | 'dissolving'>('idle');
  const [fulcrumState, setFulcrumState] = useState<'idle' | 'freeze' | 'explode' | 'returning'>('idle');
  const animationStartTimeRef = useRef<number>(0);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  
  // Generate particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a sphere initially
      const radius = Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);
  
  // Store original positions when component mounts
  useEffect(() => {
    if (!originalPositionsRef.current) {
      originalPositionsRef.current = positions.slice();
    }
  }, [positions]);
  
  // Handle mode changes
  useEffect(() => {
    if (mode === 'NOEMA' && noemaState === 'idle') {
      setNoemaState('formingGrid');
      animationStartTimeRef.current = Date.now();
    } else if (mode === 'FULCRUM' && fulcrumState === 'idle') {
      setFulcrumState('freeze');
      animationStartTimeRef.current = Date.now();
    } else if (mode === 'IDLE') {
      setNoemaState('idle');
      setFulcrumState('idle');
    }
  }, [mode, noemaState, fulcrumState]);
  
  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const elapsedTime = (Date.now() - animationStartTimeRef.current) / 1000;
    
    // Handle NOEMA mode animation states
    if (mode === 'NOEMA') {
      switch (noemaState) {
        case 'formingGrid':
          // Form particles into a 3D grid structure
          formGrid(positions, elapsedTime);
          if (elapsedTime > 1.5) {
            setNoemaState('pulse');
            animationStartTimeRef.current = Date.now();
          }
          break;
        case 'pulse':
          // Pulse effect through the grid
          pulseGrid(positions, elapsedTime);
          if (elapsedTime > 2.0) {
            setNoemaState('dissolving');
            animationStartTimeRef.current = Date.now();
          }
          break;
        case 'dissolving':
          // Dissolve back to organic flow
          dissolveGrid(positions, elapsedTime, time);
          if (elapsedTime > 1.5) {
            setNoemaState('formingGrid');
            animationStartTimeRef.current = Date.now();
          }
          break;
      }
    }
    // Handle FULCRUM mode animation states
    else if (mode === 'FULCRUM') {
      switch (fulcrumState) {
        case 'freeze':
          // Freeze all particles
          if (elapsedTime > 0.5) {
            setFulcrumState('explode');
            animationStartTimeRef.current = Date.now();
          }
          break;
        case 'explode':
          // Radial explosion from center
          explodeParticles(positions, elapsedTime);
          if (elapsedTime > 1.0) {
            setFulcrumState('returning');
            animationStartTimeRef.current = Date.now();
          }
          break;
        case 'returning':
          // Return to normal flow
          returnToFlow(positions, elapsedTime, time);
          if (elapsedTime > 1.5) {
            setFulcrumState('freeze');
            animationStartTimeRef.current = Date.now();
          }
          break;
      }
    }
    // Default blue ocean motion
    else {
      for (let i = 0; i < particleCount * 3; i += 3) {
        const i3 = i / 3;
        positions[i] += Math.sin(time * 0.1 + i3 * 0.001) * 0.005;
        positions[i + 1] += Math.cos(time * 0.15 + i3 * 0.001) * 0.005;
        positions[i + 2] += Math.sin(time * 0.2 + i3 * 0.001) * 0.005;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Function to form particles into a 3D grid for NOEMA mode
  const formGrid = (positions: Float32Array, elapsedTime: number) => {
    const gridSize = Math.cbrt(particleCount);
    const spacing = 0.5;
    const progress = Math.min(1, elapsedTime / 1.5);
    
    for (let i = 0; i < particleCount; i++) {
      const gridX = i % gridSize;
      const gridY = Math.floor(i / gridSize) % gridSize;
      const gridZ = Math.floor(i / (gridSize * gridSize));
      
      const targetX = (gridX - gridSize / 2) * spacing;
      const targetY = (gridY - gridSize / 2) * spacing;
      const targetZ = (gridZ - gridSize / 2) * spacing;
      
      const idx = i * 3;
      positions[idx] = positions[idx] * (1 - progress) + targetX * progress;
      positions[idx + 1] = positions[idx + 1] * (1 - progress) + targetY * progress;
      positions[idx + 2] = positions[idx + 2] * (1 - progress) + targetZ * progress;
    }
  };

  // Function to create pulse effect through the grid for NOEMA mode
  const pulseGrid = (positions: Float32Array, elapsedTime: number) => {
    const gridSize = Math.cbrt(particleCount);
    const pulseProgress = Math.min(1, elapsedTime / 2.0);
    const pulseCenter = pulseProgress * gridSize;
    
    for (let i = 0; i < particleCount; i++) {
      const gridX = i % gridSize;
      const distance = Math.abs(gridX - pulseCenter);
      const pulseEffect = Math.max(0, 1 - distance / 5) * Math.sin(elapsedTime * 10);
      
      const idx = i * 3;
      positions[idx] += pulseEffect * 0.1;
      positions[idx + 1] += pulseEffect * 0.1;
      positions[idx + 2] += pulseEffect * 0.1;
    }
  };

  // Function to dissolve the grid back to organic flow for NOEMA mode
  const dissolveGrid = (positions: Float32Array, elapsedTime: number, time: number) => {
    const progress = Math.min(1, elapsedTime / 1.5);
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const i3 = i;
      
      // Interpolate back to organic motion
      const organicX = positions[idx] + Math.sin(time * 0.5 + i3 * 0.01) * 0.01;
      const organicY = positions[idx + 1] + Math.cos(time * 0.3 + i3 * 0.01) * 0.01;
      const organicZ = positions[idx + 2] + Math.sin(time * 0.7 + i3 * 0.01) * 0.01;
      
      positions[idx] = positions[idx] * (1 - progress) + organicX * progress;
      positions[idx + 1] = positions[idx + 1] * (1 - progress) + organicY * progress;
      positions[idx + 2] = positions[idx + 2] * (1 - progress) + organicZ * progress;
    }
  };

  // Function to create radial explosion for FULCRUM mode
  const explodeParticles = (positions: Float32Array, elapsedTime: number) => {
    const progress = Math.min(1, elapsedTime / 1.0);
    const explosionForce = progress * 5;
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const distanceFromCenter = Math.sqrt(
        positions[idx] * positions[idx] +
        positions[idx + 1] * positions[idx + 1] +
        positions[idx + 2] * positions[idx + 2]
      );
      
      // Normalize direction vector
      if (distanceFromCenter > 0) {
        const dirX = positions[idx] / distanceFromCenter;
        const dirY = positions[idx + 1] / distanceFromCenter;
        const dirZ = positions[idx + 2] / distanceFromCenter;
        
        positions[idx] += dirX * explosionForce;
        positions[idx + 1] += dirY * explosionForce;
        positions[idx + 2] += dirZ * explosionForce;
      }
    }
  };

  // Function to return particles to normal flow for FULCRUM mode
  const returnToFlow = (positions: Float32Array, elapsedTime: number, time: number) => {
    const progress = Math.min(1, elapsedTime / 1.5);
    
    // If we have original positions, interpolate back to them
    if (originalPositionsRef.current) {
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const i3 = i;
        
        // Calculate organic motion
        const organicX = originalPositionsRef.current[idx] + Math.sin(time * 2 + i3 * 0.1) * 0.1;
        const organicY = originalPositionsRef.current[idx + 1] + Math.cos(time * 1.5 + i3 * 0.1) * 0.1;
        const organicZ = originalPositionsRef.current[idx + 2] + Math.sin(time * 3 + i3 * 0.1) * 0.1;
        
        positions[idx] = positions[idx] * (1 - progress) + organicX * progress;
        positions[idx + 1] = positions[idx + 1] * (1 - progress) + organicY * progress;
        positions[idx + 2] = positions[idx + 2] * (1 - progress) + organicZ * progress;
      }
    }
  };

  // Determine color based on mode
  const getColor = () => {
    switch (mode) {
      case 'NOEMA': return '#39FF14'; // Green Neon
      case 'FULCRUM': return '#DC143C'; // Crimson Red
      default: return '#0033FF'; // Vivid Blue
    }
  };

  return (
    <Points ref={pointsRef}>
      <PointMaterial
        color={getColor()}
        size={0.02}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
};

export default function CausalityEngine() {
  // State for the engine phases
  const [phase, setPhase] = useState<'initial' | 'loading' | 'explosion' | 'ocean'>('initial');
  
  // Create initial singularity point
  const singularityRef = useRef<THREE.Points>(null);
  
  // Handle phase transitions
  useEffect(() => {
    if (phase === 'initial') {
      // Start loading phase after a short delay
      const timer = setTimeout(() => {
        setPhase('loading');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    if (phase === 'loading') {
      // Transition to explosion after loading animation
      const timer = setTimeout(() => {
        setPhase('explosion');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    if (phase === 'explosion') {
      // Transition to stable ocean state
      const timer = setTimeout(() => {
        setPhase('ocean');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Simulate loading animation for the singularity
  useFrame((state) => {
    if (phase === 'loading' && singularityRef.current) {
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 10) * 0.2;
      singularityRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <div className="w-full h-screen bg-black">
      <Canvas className="w-full h-full">
        <ScrollControls pages={4} distance={1}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          {/* Initial Singularity */}
          {phase === 'initial' && (
            <Points ref={singularityRef}>
              <PointMaterial
                color="#ffffff"
                size={0.1}
                sizeAttenuation={true}
              />
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={1}
                  array={new Float32Array([0, 0, 0])}
                  itemSize={3}
                />
              </bufferGeometry>
            </Points>
          )}
          
          {/* Loading Indicator */}
          {phase === 'loading' && <LoadingIndicator />}
          
          {/* Particle Explosion and Ocean */}
          {phase === 'ocean' && <ParticleOcean />}
          
          {/* Controllers */}
          <InteractionController />
          <NarrativeController />
          
          {/* Controls for development */}
          <OrbitControls enableZoom={true} enablePan={true} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}