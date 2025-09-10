# Changelog

## [1.0.3] - 2025-09-10

### Fixed
- Corregido error crítico "R3F: Hooks can only be used within the Canvas component!" en `NarrativeController.tsx`
- Reemplazado `useFrame` con `useEffect` y `setInterval` para actualizar la posición del scroll fuera del contexto del Canvas
- Eliminado `useFrame` import de `NarrativeController.tsx`

### Changed
- Actualizado la documentación en `DEVELOPMENT.md` para reflejar el cambio en el manejo de scroll updates
- Añadido estado `scrollProgress` para manejar la posición del scroll

## [1.0.2] - 2025-09-10

### Fixed
- Corregido error de compilación en `NarrativeController.tsx` donde se utilizaba `scroll.subscribe` que no existe en el tipo `ScrollControlsState`
- Actualizado el componente para usar `useFrame` para scroll position updates, que es el método correcto según la API de @react-three/drei

### Changed
- Actualizado la documentación en `DEVELOPMENT.md` para reflejar el cambio en la API de scroll controls
- Añadido `useFrame` import en `NarrativeController.tsx`

## [1.0.1] - 2025-09-09

### Fixed
- Corregido error de compilación en `NarrativeController.tsx` donde se utilizaba `scroll.onChange` en lugar de `scroll.subscribe` para ser compatible con la API actual de @react-three/drei

### Changed
- Actualizado la documentación en `DEVELOPMENT.md` para reflejar el cambio en la API de scroll controls
- Añadido script de validación `validate.js` para verificar errores comunes sin necesidad de una compilación completa

## [1.0.0] - 2025-09-09

### Added
- Implementación inicial del SYNARCH Causality Engine
- Configuración completa del proyecto Next.js 14+ con TypeScript
- Componente principal `CausalityEngine.tsx` con las cuatro fases:
  - Singularidad inicial
  - Animación de carga
  - Explosión de partículas
  - Océano de datos
- Controlador narrativo `NarrativeController.tsx` con desplazamiento controlado por scroll
- Controlador de interacción `InteractionController.tsx` para el seguimiento del ratón
- Contexto global `ModeContext.tsx` para la gestión del estado entre modos
- Indicador de carga `LoadingIndicator.tsx` para la fase de inicialización
- Documentación completa del proyecto:
  - README.md: Descripción general y características
  - DEVELOPMENT.md: Guía de desarrollo y configuración
  - ARCHITECTURE.md: Documentación de arquitectura
  - COMPONENTS.md: Diagramas y jerarquía de componentes
  - CHANGELOG.md: Registro de cambios