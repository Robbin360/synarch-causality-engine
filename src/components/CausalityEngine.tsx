'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import NarrativeController from './NarrativeController';
import InteractionController from './InteractionController';
import { useMode } from './ModeContext';
import LoadingIndicator from './LoadingIndicator';

// Custom shader material for the particle ocean
const ParticleOcean = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 500000;
  const { mode } = useMode();
  
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
  
  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const i3 = i / 3;
      
      // Apply different behaviors based on mode
      switch (mode) {
        case 'NOEMA':
          // Green neon effect with wave motion
          positions[i] += Math.sin(time * 0.5 + i3 * 0.01) * 0.01;
          positions[i + 1] += Math.cos(time * 0.3 + i3 * 0.01) * 0.01;
          positions[i + 2] += Math.sin(time * 0.7 + i3 * 0.01) * 0.01;
          break;
        case 'FULCRUM':
          // Red glitch effect
          positions[i] += Math.sin(time * 2 + i3 * 0.1) * 0.1;
          positions[i + 1] += Math.cos(time * 1.5 + i3 * 0.1) * 0.1;
          positions[i + 2] += Math.sin(time * 3 + i3 * 0.1) * 0.1;
          break;
        default:
          // Default blue ocean motion
          positions[i] += Math.sin(time * 0.1 + i3 * 0.001) * 0.005;
          positions[i + 1] += Math.cos(time * 0.15 + i3 * 0.001) * 0.005;
          positions[i + 2] += Math.sin(time * 0.2 + i3 * 0.001) * 0.005;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

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
        <NarrativeController />
        <InteractionController />
        
        {/* Controls for development */}
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}