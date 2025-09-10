# Component Architecture

## Overview

```mermaid
graph TD
    A[Next.js App] --> B[Layout]
    B --> C[Page]
    C --> D[CausalityEngine]
    D --> E[Canvas]
    E --> F[PerspectiveCamera]
    E --> G[AmbientLight]
    E --> H[PointLight]
    E --> I[Singularity Points]
    E --> J[LoadingIndicator]
    E --> K[ParticleOcean]
    E --> L[NarrativeController]
    E --> M[InteractionController]
    E --> N[OrbitControls]
    L --> O[ScrollControls]
    O --> P[Html - SYNARCH]
    O --> Q[Html - Manifesto]
    O --> R[Html - NOEMA]
    O --> S[Html - FULCRUM]
    M --> T[useMode]
    K --> U[useMode]
    R --> V[onMouseEnter - NOEMA]
    S --> W[onMouseEnter - FULCRUM]
    V --> X[setMode NOEMA]
    W --> Y[setMode FULCRUM]
    X --> Z[ModeContext]
    Y --> Z
    T --> Z
    U --> Z
```

## Component Hierarchy

```
App (Next.js)
└── Layout
    └── Page
        └── ModeProvider
            └── CausalityEngine
                └── Canvas
                    ├── PerspectiveCamera
                    ├── AmbientLight
                    ├── PointLight
                    ├── Points (Singularity)
                    ├── LoadingIndicator
                    ├── ParticleOcean
                    │   └── Points (500k particles)
                    ├── NarrativeController
                    │   └── ScrollControls
                    │       ├── Html (SYNARCH)
                    │       ├── Html (Manifesto)
                    │       ├── Html (NOEMA)
                    │       └── Html (FULCRUM)
                    ├── InteractionController
                    └── OrbitControls
```

## Data Flow

1. **Initialization Flow**:
   ```
   App → Layout → Page → ModeProvider → CausalityEngine → Canvas
   ```

2. **Phase Transition Flow**:
   ```
   CausalityEngine: initial → useEffect → loading → useEffect → explosion → useEffect → ocean
   ```

3. **Scroll Control Flow**:
   ```
   ScrollControls → useScroll → Html components → opacity changes
   ```

4. **Mode Change Flow**:
   ```
   User Interaction → Html events → setMode → ModeContext → ParticleOcean → color/behavior change
   ```

5. **Animation Flow**:
   ```
   useFrame → Particle positions update → GPU rendering
   ```

## State Management

### Global State (ModeContext)
```typescript
type Mode = 'IDLE' | 'NOEMA' | 'FULCRUM'

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
}
```

### Component State (CausalityEngine)
```typescript
type Phase = 'initial' | 'loading' | 'explosion' | 'ocean'

const [phase, setPhase] = useState<Phase>('initial')
```

## Event Handling

### Mouse Events
- `onMouseEnter` / `onMouseLeave` on Html components
- Custom event dispatch for mode changes
- Window-level event listeners for mouse position

### Scroll Events
- Drei's `useScroll` hook
- Custom scroll position tracking
- Opacity transitions based on scroll progress

### Animation Events
- React Three Fiber's `useFrame` hook
- Three.js clock for time-based animations
- Conditional updates based on phase and mode

## Performance Optimization Points

1. **Dynamic Imports**: 3D components only loaded client-side
2. **Buffer Geometries**: Efficient particle storage
3. **useMemo**: Position array generation optimization
4. **Conditional Rendering**: Components only rendered when needed
5. **Event Cleanup**: Proper removal of listeners to prevent memory leaks
6. **AnimationFrame**: Synchronized updates with browser refresh rate