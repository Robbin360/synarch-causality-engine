'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Vertex shader with noise and animation
const vertexShader = `
uniform float uTime;
uniform float uAnimationProgress;
uniform vec2 uMouse;
uniform int uMode;
uniform float uBigBangProgress;
uniform float uModeTransition;

attribute vec3 aOriginalPosition;
attribute float aParticleId;

// Simplex noise function
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

// Easing function
float easeOutCubic(float t) {
  return 1.0 - pow(1.0 - t, 3.0);
}

void main() {
  vec3 pos = position;
  
  // Big Bang animation
  if (uBigBangProgress < 1.0) {
    // Animate from origin to final position
    float easedProgress = easeOutCubic(uBigBangProgress);
    pos = mix(vec3(0.0), aOriginalPosition, easedProgress);
  } else {
    // Normal organic movement with noise
    pos = aOriginalPosition;
    
    // Mode-specific transformations
    if (uMode == 1) { // NOEMA - Grid scanning animation
      float gridSize = 80.0;
      float scanSpeed = 2.0;
      float scanPosition = mod(uTime * scanSpeed, gridSize) - gridSize * 0.5;
      
      // Create grid alignment effect
      vec3 gridPos = floor(pos / 2.0) * 2.0;
      float distanceToScan = abs(pos.x - scanPosition);
      float gridInfluence = 1.0 - smoothstep(0.0, 5.0, distanceToScan);
      
      pos = mix(pos, gridPos, gridInfluence * uModeTransition * 0.8);
      
      // Add pulsing effect
      float pulse = sin(uTime * 8.0 + aParticleId * 0.1) * 0.2;
      pos += vec3(0.0, pulse * gridInfluence, 0.0);
      
    } else if (uMode == 2) { // FULCRUM - Shockwave animation
      float waveSpeed = 3.0;
      float waveRadius = mod(uTime * waveSpeed, 30.0);
      float distanceFromCenter = length(pos);
      
      // Freeze effect before shockwave
      float freezeZone = smoothstep(waveRadius - 2.0, waveRadius, distanceFromCenter);
      float shockwaveEffect = smoothstep(waveRadius, waveRadius + 3.0, distanceFromCenter);
      
      // Radial explosion effect
      vec3 direction = normalize(pos);
      float explosionForce = (1.0 - shockwaveEffect) * freezeZone * 3.0;
      pos += direction * explosionForce * uModeTransition;
      
      // Add crimson glow pulsing
      float crimsonPulse = sin(uTime * 12.0) * 0.1;
      pos += direction * crimsonPulse * uModeTransition;
    }
    
    // Base organic noise movement (reduced when in special modes)
    float noiseScale = 0.1;
    float timeScale = 0.5;
    vec3 noiseInput = pos * noiseScale + uTime * timeScale;
    
    vec3 noiseOffset = vec3(
      snoise(noiseInput),
      snoise(noiseInput + vec3(100.0)),
      snoise(noiseInput + vec3(200.0))
    ) * 0.5 * (1.0 - uModeTransition * 0.7);
    
    pos += noiseOffset;
    
    // Mouse interaction (gravity effect)
    vec2 mousePos = uMouse * 2.0 - 1.0;
    vec3 mouseWorld = vec3(mousePos * 10.0, 0.0);
    float distanceToMouse = distance(pos, mouseWorld);
    float influence = 1.0 / (1.0 + distanceToMouse * 0.1);
    vec3 direction = normalize(pos - mouseWorld);
    pos += direction * influence * 0.5;
  }
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0;
}
`

// Fragment shader for particle colors
const fragmentShader = `
uniform float uTime;
uniform int uMode;

void main() {
  // Create circular particles
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  if (dist > 0.5) discard;
  
  // Color based on mode
  vec3 color;
  if (uMode == 1) { // NOEMA
    color = vec3(0.22, 1.0, 0.08); // Green Neon
  } else if (uMode == 2) { // FULCRUM
    color = vec3(0.86, 0.08, 0.24); // Crimson Red
  } else { // IDLE
    color = vec3(0.0, 0.4, 1.0); // Vivid Blue
  }
  
  float alpha = 1.0 - dist * 2.0;
  gl_FragColor = vec4(color, alpha * 0.8);
}
`

interface ParticleEngineProps {
  mode?: 'IDLE' | 'NOEMA' | 'FULCRUM'
  mousePosition?: [number, number]
}

export function ParticleEngine({ mode = 'IDLE', mousePosition = [0, 0] }: ParticleEngineProps) {
  const meshRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [animationPhase, setAnimationPhase] = useState<'tension' | 'explosion' | 'stable'>('tension')
  const [startTime] = useState(() => Date.now())
  
  const particleCount = 500000
  
  // Generate particle positions
  const { positions, originalPositions, particleIds } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const originalPositions = new Float32Array(particleCount * 3)
    const particleIds = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Distribute particles in a sphere
      const radius = Math.random() * 15 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      
      positions[i] = x
      positions[i + 1] = y
      positions[i + 2] = z
      
      originalPositions[i] = x
      originalPositions[i + 1] = y
      originalPositions[i + 2] = z
      
      particleIds[i / 3] = i / 3
    }
    
    return { positions, originalPositions, particleIds }
  }, [])
  
  // Shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAnimationProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMode: { value: 0 },
        uBigBangProgress: { value: 0 },
        uModeTransition: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  }, [])
  
  // Animation logic
  useFrame((state) => {
    if (!materialRef.current) return
    
    const elapsed = (Date.now() - startTime) / 1000
    const uniforms = materialRef.current.uniforms
    
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uMouse.value.set(mousePosition[0], mousePosition[1])
    
    // Mode mapping and transition
    const modeValue = mode === 'NOEMA' ? 1 : mode === 'FULCRUM' ? 2 : 0
    uniforms.uMode.value = modeValue
    
    // Smooth mode transition
    const targetTransition = mode !== 'IDLE' ? 1.0 : 0.0
    uniforms.uModeTransition.value += (targetTransition - uniforms.uModeTransition.value) * 0.05
    
    // Big Bang animation phases
    if (elapsed < 2.0) {
      // Tension phase (0-2s): just the singularity
      setAnimationPhase('tension')
      uniforms.uBigBangProgress.value = 0
    } else if (elapsed < 3.0) {
      // Explosion phase (2-3s): particles expand from origin
      setAnimationPhase('explosion')
      const explosionProgress = (elapsed - 2.0) / 1.0
      uniforms.uBigBangProgress.value = explosionProgress
    } else {
      // Stable phase (3s+): normal organic movement
      setAnimationPhase('stable')
      uniforms.uBigBangProgress.value = 1.0
    }
  })
  
  // Singularity component for tension phase
  const Singularity = () => {
    const singularityRef = useRef<THREE.Points>(null)
    
    useFrame((state) => {
      if (!singularityRef.current || animationPhase !== 'tension') return
      
      const time = state.clock.elapsedTime
      const scale = 1 + Math.sin(time * 8) * 0.3
      const opacity = 0.8 + Math.sin(time * 12) * 0.2
      
      singularityRef.current.scale.setScalar(scale)
      if (singularityRef.current.material instanceof THREE.PointsMaterial) {
        singularityRef.current.material.opacity = opacity
      }
    })
    
    if (animationPhase !== 'tension') return null
    
    return (
      <points ref={singularityRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1}
            array={new Float32Array([0, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={20}
          transparent
          opacity={0.8}
          sizeAttenuation={false}
        />
      </points>
    )
  }
  
  return (
    <>
      <Singularity />
      {animationPhase !== 'tension' && (
        <points ref={meshRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-aOriginalPosition"
              count={particleCount}
              array={originalPositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-aParticleId"
              count={particleCount}
              array={particleIds}
              itemSize={1}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={materialRef}
            attach="material"
            args={[shaderMaterial]}
          />
        </points>
      )}
    </>
  )
}
