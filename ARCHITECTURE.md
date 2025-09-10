# Architecture Documentation

## System Overview

The SYNARCH Causality Engine is a Next.js 14+ application that renders a complex 3D particle system using Three.js and React Three Fiber. The system implements a four-phase experience that visualizes computational causality through interactive data particles.

## Core Components

### 1. CausalityEngine.tsx
**Responsibility**: Main orchestrator of the 3D experience

**Key Features**:
- Phase management (initial → loading → explosion → ocean)
- Three.js scene setup with camera and lighting
- Particle system implementation
- Integration with controllers

**Technical Details**:
- Uses React Three Fiber's `useFrame` for animation loops
- Implements buffer geometries for performance
- Manages phase transitions with useEffect hooks

### 2. NarrativeController.tsx
**Responsibility**: Scroll-based narrative progression

**Key Features**:
- ScrollControls integration for camera movement
- HTML overlays for text content
- Scroll position tracking and opacity transitions

**Technical Details**:
- Uses Drei's `useScroll` hook for scroll position
- Implements custom scroll event handling
- Manages HTML element positioning in 3D space

### 3. InteractionController.tsx
**Responsibility**: User interaction handling

**Key Features**:
- Mouse position tracking
- Mode switching (NOEMA/FULCRUM/IDLE)
- Event listener management

**Technical Details**:
- Uses Three.js mouse events
- Implements custom event system
- Integrates with ModeContext for state management

### 4. ModeContext.tsx
**Responsibility**: Global state management

**Key Features**:
- Context provider for mode state
- useMode hook for consuming state
- Type-safe mode transitions

**Technical Details**:
- Implements React Context API
- Provides centralized state management
- Ensures consistent state across components

## Technical Architecture

### Rendering Pipeline
```
1. Next.js App Router
   ↓
2. Dynamic import (SSR disabled)
   ↓
3. Canvas initialization
   ↓
4. Scene setup (camera, lights)
   ↓
5. Phase-specific components
   ↓
6. Animation loop (useFrame)
   ↓
7. Shader-based particle rendering
```

### State Management
```
Global State (ModeContext):
- mode: 'IDLE' | 'NOEMA' | 'FULCRUM'

Component State (CausalityEngine):
- phase: 'initial' | 'loading' | 'explosion' | 'ocean'
```

### Performance Considerations

1. **Buffer Geometries**: Used for efficient particle rendering
2. **Dynamic Imports**: 3D components loaded only on client
3. **Animation Optimization**: useFrame with conditional updates
4. **Memory Management**: Proper cleanup of event listeners
5. **Lazy Loading**: Components loaded as needed

## Design Patterns

### 1. Context Pattern
Used for global state management of the system mode:
```tsx
<ModeProvider>
  <CausalityEngine />
</ModeProvider>
```

### 2. Dynamic Import Pattern
Ensures 3D components only run in browser:
```tsx
const CausalityEngine = dynamic(() => import('@/components/CausalityEngine'), {
  ssr: false,
});
```

### 3. Custom Hook Pattern
Encapsulates complex logic in reusable hooks:
```tsx
const { mode, setMode } = useMode();
```

### 4. Composition Pattern
Builds complex UIs from simpler components:
```tsx
<CausalityEngine>
  <NarrativeController />
  <InteractionController />
</CausalityEngine>
```

## Requirements Fulfillment

### RF-1.x: Next.js Project Structure
✅ Implemented with App Router
✅ TypeScript support
✅ Dynamic imports with SSR disabled

### RF-2.x: Particle Engine
✅ Initial singularity point
✅ Loading animation (vibration)
✅ Explosion into 500k particles
✅ Ocean state with continuous animation

### RF-3.x: Narrative Control
✅ ScrollControls for camera movement
✅ HTML overlays for text content
✅ Opacity transitions based on scroll

### RF-4.x: Interaction System
✅ Mouse position tracking
✅ Mode switching (NOEMA/FULCRUM)
✅ Visual feedback for interactions

## Future Architecture Considerations

### Scalability
- Implement Web Workers for heavy computations
- Add level-of-detail (LOD) for particle systems
- Consider offscreen canvas for complex rendering

### Extensibility
- Plugin architecture for additional visualizations
- Modular shader system for different effects
- Configurable particle behaviors

### Performance
- GPU instancing for particle rendering
- Texture-based particle systems
- Adaptive quality based on device capabilities

## Security Considerations

- Client-side only execution prevents SSR vulnerabilities
- No external data dependencies reduce attack surface
- Strict TypeScript typing prevents runtime errors
- Proper event listener cleanup prevents memory leaks