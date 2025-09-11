import { create } from 'zustand'

export type Mode = 'IDLE' | 'NOEMA' | 'FULCRUM'

interface ModeState {
  currentMode: Mode
  setMode: (mode: Mode) => void
  mousePosition: [number, number]
  setMousePosition: (position: [number, number]) => void
}

export const useModeStore = create<ModeState>((set) => ({
  currentMode: 'IDLE',
  setMode: (mode) => set({ currentMode: mode }),
  mousePosition: [0, 0],
  setMousePosition: (position) => set({ mousePosition: position }),
}))
