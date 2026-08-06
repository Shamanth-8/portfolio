import { create } from 'zustand'

interface ShellStore {
  /** false = desktop sits inside the CRT bezel; true = screen fills the viewport. */
  immersive: boolean
  /** Boot log finished — desktop icons and the header cue may animate in. */
  booted: boolean
  /** Home was pressed: the GRUB menu + welcome sequence is playing. */
  rebooting: boolean
  toggleImmersive: () => void
  setBooted: (v: boolean) => void
  setRebooting: (v: boolean) => void
}

export const useShell = create<ShellStore>((set) => ({
  immersive: false,
  booted: false,
  rebooting: false,
  toggleImmersive: () => set((s) => ({ immersive: !s.immersive })),
  setBooted: (booted) => set({ booted }),
  setRebooting: (rebooting) => set({ rebooting }),
}))

/** Visitors who already sat through the boot log get the desktop immediately. */
export const BOOT_KEY = 'portfolio:booted'

export function hasBootedBefore() {
  try {
    return sessionStorage.getItem(BOOT_KEY) === '1'
  } catch {
    return false
  }
}

export function rememberBoot() {
  try {
    sessionStorage.setItem(BOOT_KEY, '1')
  } catch {
    /* private mode — just replay the boot next time */
  }
}
