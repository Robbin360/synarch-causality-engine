# SYNARCH Causality Engine - Visual Core

This project implements an interactive 3D experience called the "Causality Engine" using Next.js 14+, React 18, TypeScript, and Three.js with React Three Fiber.

## Project Overview

The Causality Engine visualizes computational causality through an interactive 3D particle system. Users can explore different states of the system by scrolling through narrative sections and interacting with specific elements.

## Features

1. **Big Bang Sequence**:
   - Initial singularity point
   - Loading animation with particle vibration
   - Explosion into a massive particle system (~500,000 particles)

2. **Ocean of Data**:
   - Continuous particle motion using shader-based animations
   - Dynamic color changes based on system modes
   - Organic flow using 3D noise algorithms

3. **Narrative Scroll Control**:
   - Scroll-linked camera movement along the Z-axis
   - Text sections that appear/disappear based on scroll position
   - Content sections: SYNARCH, Manifesto, NOEMA, FULCRUM

4. **Interactive Modes**:
   - **NOEMA**: Green neon effect representing digital consciousness
   - **FULCRUM**: Red glitch effect representing system pivot points
   - Mouse gravity effect that influences particle deformation

## Technical Implementation

### Stack
- Next.js 14+ (App Router)
- React 18 with TypeScript
- Three.js r160+
- React Three Fiber (@react-three/fiber)
- Drei (@react-three/drei)

### Component Architecture
1. `CausalityEngine.tsx` - Main 3D engine component
2. `NarrativeController.tsx` - Scroll-based narrative elements
3. `InteractionController.tsx` - Mouse and mode interaction handler
4. `ModeContext.tsx` - Global state management for system modes
5. `LoadingIndicator.tsx` - Visual loading indicator

### Key Technical Details
- Dynamic import with SSR disabled for 3D components
- Custom shaders for particle animation
- Scroll controls for narrative progression
- Context API for state management between components
- Performance optimizations for 500k particle system

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## System Modes

- **IDLE**: Default blue ocean state
- **NOEMA**: Green neon effect (hover over "Engage with NOEMA" text)
- **FULCRUM**: Red glitch effect (hover over "Activate FULCRUM" text)

## Architecture Notes

The implementation follows the requirements specified in the project documentation:
- RF-1.x: Next.js project structure with TypeScript
- RF-2.x: Particle engine with singularity, explosion, and ocean states
- RF-3.x: Scroll-controlled narrative with HTML overlays
- RF-4.x: Interactive modes with mouse gravity effects

## Future Enhancements

- Implement actual GLSL shaders for more complex particle behaviors
- Add audio visualization components
- Implement more sophisticated physics simulations
- Add VR/AR support for immersive experiences