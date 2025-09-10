# Development Guide

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
└── components/
    ├── CausalityEngine.tsx
    ├── NarrativeController.tsx
    ├── InteractionController.tsx
    ├── ModeContext.tsx
    └── LoadingIndicator.tsx
```

## Implemented Features

1. **Next.js 14+ App Router** setup with TypeScript
2. **Causality Engine** 3D visualization with Three.js and React Three Fiber
3. **Four-phase experience**:
   - Initial singularity
   - Loading animation
   - Particle explosion
   - Ocean of data
4. **Scroll-controlled narrative** with HTML overlays
5. **Interactive modes** (NOEMA, FULCRUM) with visual feedback
6. **Context-based state management** for mode switching
7. **Performance optimizations** for 500k particle system

## Dependencies

All required dependencies are listed in package.json:
- next@14.2.3
- react@18
- react-dom@18
- three@0.160.0
- @react-three/fiber@8.15.20
- @react-three/drei@9.112.0

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Component Details

### CausalityEngine.tsx
Main 3D engine component that manages the four phases of the experience:
- Initial singularity point
- Loading animation with vibrating particle
- Explosion into 500k particle system
- Continuous "ocean" animation
- **REFactORED**: Canvas wrapped with ScrollControls for proper scroll integration
- **REFactORED**: NarrativeController rendered inside Canvas for proper 3D integration

### NarrativeController.tsx
Handles scroll-based narrative progression:
- **REFactORED**: Uses Html components from @react-three/drei for 3D text positioning
- **REFactORED**: Uses useScroll and useFrame hooks for scroll synchronization
- **REFactORED**: Text positioned in 3D space along Z-axis
- Opacity transitions based on scroll position

### InteractionController.tsx
Manages user interactions:
- Mouse position tracking
- Mode switching (NOEMA/FULCRUM/IDLE)
- Integration with ModeContext
- **CORRECT**: Properly used within the Canvas component

### ModeContext.tsx
Global state management for system modes:
- Provider component wrapping the app
- useMode hook for accessing state
- Mode transitions between IDLE/NOEMA/FULCRUM

### LoadingIndicator.tsx
Visual indicator during the loading phase:
- Animated pulsing dots
- "Initializing Causality Engine" text

## Technical Notes

1. **SSR Disabled**: The 3D components are dynamically imported with `ssr: false` to ensure they only run in the browser.

2. **Performance**: The particle system uses buffer geometries and optimized animation loops to handle 500k particles efficiently.

3. **Responsive Design**: The canvas fills the entire screen and adapts to different viewport sizes.

4. **Type Safety**: Full TypeScript support with proper typing for all components and hooks.

## Recent Fixes

- **Architecture Refactor**: Reintegrated NarrativeController inside Canvas with proper ScrollControls wrapper
- **3D Text Integration**: Refactored NarrativeController to use Html components for 3D text positioning
- **Scroll Synchronization**: Implemented useScroll and useFrame for proper scroll position tracking

## Future Enhancements

1. **GLSL Shaders**: Implement custom vertex and fragment shaders for more complex particle behaviors
2. **Audio Integration**: Add spatial audio that responds to particle movements
3. **Physics Simulation**: Integrate a physics engine for more realistic particle interactions
4. **VR/AR Support**: Extend the experience to immersive environments
5. **Data Visualization**: Connect the particle system to real-time data sources