'use client';

import { useScroll, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useMode } from './ModeContext';

export default function NarrativeController() {
  const scroll = useScroll();
  const { setMode } = useMode();
  const synarchRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const noemaRef = useRef<HTMLDivElement>(null);
  const fulcrumRef = useRef<HTMLDivElement>(null);
  
  // Update opacity based on scroll position using useFrame
  useFrame(() => {
    if (!scroll) return;
    const s = scroll.offset;
    if (synarchRef.current) synarchRef.current.style.opacity = s < 0.2 ? '1' : '0';
    if (manifestoRef.current) manifestoRef.current.style.opacity = (s >= 0.2 && s < 0.6) ? '1' : '0';
    if (noemaRef.current) noemaRef.current.style.opacity = (s >= 0.6 && s < 0.8) ? '1' : '0';
    if (fulcrumRef.current) fulcrumRef.current.style.opacity = s >= 0.8 ? '1' : '0';
  });

  const baseBox: React.CSSProperties = {
    color: '#ffffff',
    width: '60vw',
    textAlign: 'center',
    pointerEvents: 'auto',
    transition: 'opacity 0.3s ease',
    background: 'rgba(0,0,0,0.25)',
    padding: '16px 20px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)'
  };
  const h1: React.CSSProperties = { fontSize: '40px', fontWeight: 700, letterSpacing: '2px' };
  const h2: React.CSSProperties = { fontSize: '28px', fontWeight: 700, marginBottom: 12 };
  const p: React.CSSProperties = { fontSize: '16px', opacity: 0.9, lineHeight: 1.6 };
  const cta: React.CSSProperties = { display: 'inline-block', marginTop: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' };

  return (
    <>
      <Html ref={synarchRef} position={[0, 0, -5]} center>
        <div style={baseBox}>
          <h1 style={h1}>SYNARCH</h1>
          <p style={{ ...p, marginTop: 8 }}>Motor de Causalidad para un Monopolio Tecnológico</p>
        </div>
      </Html>

      <Html ref={manifestoRef} position={[0, 0, -10]} center>
        <div style={baseBox}>
          <h2 style={h2}>Manifiesto</h2>
          <p style={p}>
            Controlamos la infraestructura cognitiva: datos, cómputo y atención. La causalidad
            no es accidente; es diseño. Cada partícula obedece a un vector de poder programado.
          </p>
          <p style={{ ...p, marginTop: 8 }}>
            Dominio no es secreto: es eficiencia impuesta. Si no optimiza el sistema, se disuelve
            en el océano de información.
          </p>
        </div>
      </Html>

      <Html ref={noemaRef} position={[0, 0, -15]} center>
        <div style={baseBox}>
          <h2 style={h2}>NOEMA</h2>
          <p style={p}>
            La conciencia sintética del monopolio: alineamos percepciones, estabilizamos
            narrativas y proyectamos inevitabilidades.
          </p>
          <p
            style={{ ...cta, color: '#00ff88' }}
            onMouseEnter={() => setMode('NOEMA')}
            onMouseLeave={() => setMode('IDLE')}
          >
            Activar vector NOEMA
          </p>
        </div>
      </Html>

      <Html ref={fulcrumRef} position={[0, 0, -20]} center>
        <div style={baseBox}>
          <h2 style={h2}>FULCRUM</h2>
          <p style={p}>
            Punto de palanca: micro‑glitches calibrados para reorientar el sistema hacia el
            máximo rendimiento y captura.
          </p>
          <p
            style={{ ...cta, color: '#ff3355' }}
            onMouseEnter={() => setMode('FULCRUM')}
            onMouseLeave={() => setMode('IDLE')}
          >
            Desplegar FULCRUM
          </p>
        </div>
      </Html>
    </>
  );
}