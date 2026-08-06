import { create } from 'zustand'
import type { AppId } from '../apps/registry'
import { APPS } from '../apps/registry'

export interface WindowState {
  id: string
  appId: AppId
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
  maximized: boolean
  /** Pre-maximize geometry, restored when un-maximizing. */
  restore?: { x: number; y: number; w: number; h: number }
}

interface WindowStore {
  windows: WindowState[]
  topZ: number
  /** Focused window id, or null when the desktop itself has focus. */
  activeId: string | null
  /**
   * Size of the monitor's screen area — NOT the browser viewport. Everything
   * (placement, clamping, maximize) is measured against this so the desktop
   * behaves identically framed inside the CRT or expanded full-bleed.
   */
  screen: { w: number; h: number }

  setScreen: (w: number, h: number) => void
  open: (appId: AppId) => void
  close: (id: string) => void
  /** "Home" — clears the desk back to the bare desktop. */
  closeAll: () => void
  focus: (id: string) => void
  minimize: (id: string) => void
  toggleMaximize: (id: string) => void
  move: (id: string, x: number, y: number) => void
  resize: (id: string, w: number, h: number) => void
}

const MIN_W = 300
const MIN_H = 180
/** Height of the top bar; windows never travel under it. */
export const TOP_INSET = 36
/** How far each new window steps down-right from the last one. */
const CASCADE = 26

function clampPos(x: number, y: number, w: number, screen: { w: number; h: number }) {
  return {
    // Keep the title bar reachable: a window can never be dragged fully
    // off-screen or up under the top bar.
    x: Math.min(Math.max(x, 24 - w), screen.w - 24),
    y: Math.min(Math.max(y, TOP_INSET), screen.h - 24),
  }
}

export const useWindows = create<WindowStore>((set, get) => ({
  windows: [],
  topZ: 10,
  activeId: null,
  screen: { w: 1280, h: 800 },

  setScreen: (w, h) =>
    set((s) => ({
      screen: { w, h },
      // Re-fit everything so nothing is stranded outside the new screen.
      windows: s.windows.map((win) => {
        if (win.maximized) return { ...win, x: 0, y: TOP_INSET, w, h: h - TOP_INSET }
        const width = Math.min(win.w, w - 16)
        const height = Math.min(win.h, h - TOP_INSET - 16)
        return { ...win, w: width, h: height, ...clampPos(win.x, win.y, width, { w, h }) }
      }),
    })),

  open: (appId) => {
    const existing = get().windows.find((win) => win.appId === appId)
    if (existing) {
      // Re-opening a running app raises and un-minimizes it rather than duplicating.
      const z = get().topZ + 1
      set((s) => ({
        topZ: z,
        activeId: existing.id,
        windows: s.windows.map((win) =>
          win.id === existing.id ? { ...win, z, minimized: false } : win,
        ),
      }))
      return
    }

    const { screen, windows, topZ } = get()
    const app = APPS[appId]
    const w = Math.min(app.width, screen.w - 24)
    const h = Math.min(app.height, screen.h - TOP_INSET - 24)

    // Cascade from the centre so stacked windows stay individually clickable.
    const step = (windows.length % 6) * CASCADE
    const x = Math.max(12, Math.round((screen.w - w) / 2) - CASCADE * 2 + step)
    const y = Math.max(TOP_INSET + 12, Math.round((screen.h - h) / 2) - CASCADE + step)

    const z = topZ + 1
    const id = `${appId}-${Date.now()}`

    set((s) => ({
      topZ: z,
      activeId: id,
      windows: [...s.windows, { id, appId, x, y, w, h, z, minimized: false, maximized: false }],
    }))
  },

  close: (id) =>
    set((s) => ({
      windows: s.windows.filter((win) => win.id !== id),
      activeId: s.activeId === id ? null : s.activeId,
    })),

  closeAll: () => set({ windows: [], activeId: null }),

  focus: (id) => {
    const win = get().windows.find((w) => w.id === id)
    if (!win) return
    // Already on top and visible: nothing to do, and no needless re-render.
    if (win.z === get().topZ && !win.minimized && get().activeId === id) return
    const z = get().topZ + 1
    set((s) => ({
      topZ: z,
      activeId: id,
      windows: s.windows.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)),
    }))
  },

  minimize: (id) =>
    set((s) => ({
      activeId: s.activeId === id ? null : s.activeId,
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    })),

  toggleMaximize: (id) => {
    const { screen } = get()
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w
        if (w.maximized) {
          const r = w.restore ?? { x: w.x, y: w.y, w: w.w, h: w.h }
          return { ...w, ...r, maximized: false, restore: undefined }
        }
        return {
          ...w,
          restore: { x: w.x, y: w.y, w: w.w, h: w.h },
          maximized: true,
          x: 0,
          y: TOP_INSET,
          w: screen.w,
          h: screen.h - TOP_INSET,
        }
      }),
    }))
  },

  move: (id, x, y) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...clampPos(x, y, w.w, s.screen) } : w)),
    })),

  resize: (id, w, h) =>
    set((s) => ({
      windows: s.windows.map((win) =>
        win.id === id
          ? {
              ...win,
              w: Math.min(Math.max(w, MIN_W), s.screen.w),
              h: Math.min(Math.max(h, MIN_H), s.screen.h - TOP_INSET),
            }
          : win,
      ),
    })),
}))
