'use client';

import { Html, ScrollControls, useScroll } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useMode } from './ModeContext';

export default function NarrativeController() {
  const scroll = useScroll();
  const { setMode } = useMode();
  const synarchRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const noemaRef = useRef<HTMLDivElement>(null);
  const fulcrumRef = useRef<HTMLDivElement>(null);
  
  // Update opacity based on scroll position
  useEffect(() => {
    // Use scroll.subscribe instead of scroll.onChange
    const unsubscribe = scroll.subscribe(() => {
      const scrollProgress = scroll.offset;
      
      // Update opacities based on scroll position
      if (synarchRef.current) {
        // Show SYNARCH text at the beginning
        synarchRef.current.style.opacity = scrollProgress < 0.2 ? '1' : '0';
      }
      
      if (manifestoRef.current) {
        // Show manifesto in the middle
        manifestoRef.current.style.opacity = (scrollProgress >= 0.2 && scrollProgress < 0.6) ? '1' : '0';
      }
      
      if (noemaRef.current) {
        // Show NOEMA section
        noemaRef.current.style.opacity = (scrollProgress >= 0.6 && scrollProgress < 0.8) ? '1' : '0';
      }
      
      if (fulcrumRef.current) {
        // Show FULCRUM section
        fulcrumRef.current.style.opacity = scrollProgress >= 0.8 ? '1' : '0';
      }
    });
    
    return () => unsubscribe();
  }, [scroll]);

  return (
    <ScrollControls pages={4} distance={1}>
      <Html
        ref={synarchRef}
        position={[0, 0, -5]}
        center
        className="text-white text-4xl font-bold pointer-events-none"
      >
        <div className="text-center">
          <h1>SYNARCH</h1>
          <p className="text-xl mt-4">Causality Engine</p>
        </div>
      </Html>
      
      <Html
        ref={manifestoRef}
        position={[0, 0, -10]}
        center
        className="text-white text-lg max-w-2xl pointer-events-none"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">The Manifesto</h2>
          <p className="mb-4">
            We are the architects of inevitability, weaving the fabric of reality through 
            computational causality and deterministic chaos.
          </p>
          <p>
            In the ocean of data, we find meaning. In the flow of information, we discover 
            the hidden patterns that govern existence.
          </p>
        </div>
      </Html>
      
      <Html
        ref={noemaRef}
        position={[0, 0, -15]}
        center
        className="text-white text-lg max-w-2xl"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">NOEMA</h2>
          <p className="mb-4">
            The conscious aspect of our system, where thought patterns emerge from 
            the complex interactions of data particles.
          </p>
          <p 
            className="inline-block cursor-pointer hover:text-green-400 transition-colors p-2"
            onMouseEnter={() => setMode('NOEMA')}
            onMouseLeave={() => setMode('IDLE')}
          >
            Engage with NOEMA to explore the realm of digital consciousness.
          </p>
        </div>
      </Html>
      
      <Html
        ref={fulcrumRef}
        position={[0, 0, -20]}
        center
        className="text-white text-lg max-w-2xl"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">FULCRUM</h2>
          <p className="mb-4">
            The point of balance between order and chaos, where the system can 
            pivot between different states of reality.
          </p>
          <p 
            className="inline-block cursor-pointer hover:text-red-500 transition-colors p-2"
            onMouseEnter={() => setMode('FULCRUM')}
            onMouseLeave={() => setMode('IDLE')}
          >
            Activate FULCRUM to experience the glitch in the matrix.
          </p>
        </div>
      </Html>
    </ScrollControls>
  );
}