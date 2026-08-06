import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { useShell } from './shell'
import { useWindows } from './store'

/**
 * The physical machine: a monitor whose screen hosts the whole desktop.
 * `immersive` sheds the bezel so the screen fills the viewport — same DOM node,
 * so windows keep their state across the transition.
 */
export function Machine({ children }: { children: React.ReactNode }) {
  const immersive = useShell((s) => s.immersive)
  const toggleImmersive = useShell((s) => s.toggleImmersive)
  const booted = useShell((s) => s.booted)
  const setScreen = useWindows((s) => s.setScreen)
  const screenRef = useRef<HTMLDivElement>(null)

  // The window manager measures against the screen element, not the viewport.
  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setScreen(Math.round(width), Math.round(height))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [setScreen])

  return (
    <div className="room relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotateX: 6 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={
          immersive
            ? 'fixed inset-0 z-40 rounded-none border-0 bg-black p-0'
            : 'relative w-full max-w-[1240px] rounded-[22px] border border-line bg-[#0a0c10] p-3 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-[28px] sm:p-4'
        }
        style={{ transition: 'padding 450ms ease, border-radius 450ms ease' }}
      >
        <div
          ref={screenRef}
          className={
            immersive
              ? 'crt relative h-full w-full overflow-hidden bg-bg'
              // The cap leaves room for the chin and stand below the screen.
              : 'crt relative aspect-[16/10] max-h-[calc(100vh-190px)] w-full overflow-hidden rounded-lg bg-bg sm:rounded-xl'
          }
        >
          {children}
        </div>

        {!immersive && (
          // Chin: power LED + machine label, the cues that sell it as hardware.
          <div className="flex items-center justify-between px-2 pt-2.5 sm:pt-3">
            <span className="flex items-center gap-2">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-ok"
                animate={{ opacity: booted ? [0.45, 1, 0.45] : 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 8px var(--color-ok)' }}
              />
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                shamanth · dev·station
              </span>
            </span>
            <span className="font-mono text-[10px] text-muted/50">v1.0</span>
          </div>
        )}
      </motion.div>

      {/* Monitor stand — drawn only in framed mode. */}
      {!immersive && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="hidden flex-col items-center sm:flex"
          aria-hidden="true"
        >
          <div className="h-7 w-28 bg-linear-to-b from-[#1b2027] to-[#0f1318] [clip-path:polygon(22%_0,78%_0,100%_100%,0_100%)]" />
          <div className="h-2 w-56 rounded-b-lg bg-linear-to-b from-[#161b22] to-[#0b0e12] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.9)]" />
        </motion.div>
      )}

      <button
        type="button"
        onClick={toggleImmersive}
        className="fixed right-3 bottom-3 z-50 flex items-center gap-1.5 rounded-md border border-line bg-surface/85 px-2.5 py-1.5 font-mono text-[10px] text-muted backdrop-blur transition-colors hover:border-accent/60 hover:text-fg"
      >
        {immersive ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        {immersive ? 'exit screen' : 'step inside'}
      </button>
    </div>
  )
}
