import { motion } from 'motion/react'
import { ChevronLeft } from 'lucide-react'
import { APPS } from '../apps/registry'
import { useWindows } from './store'
import type { WindowState } from './store'
import { TOP_INSET } from './store'

/**
 * The mobile stand-in for a window: a full-screen sheet that slides up from the
 * bottom. No chrome to drag, no corner to grab — one back button, thumb-high.
 */
export function MobileSheet({ win }: { win: WindowState }) {
  const app = APPS[win.appId]
  const Body = app.component
  const close = useWindows((s) => s.close)

  return (
    <motion.section
      role="dialog"
      aria-label={app.title}
      className="absolute inset-x-0 bottom-0 z-50 flex flex-col border-t border-line bg-surface"
      style={{ top: TOP_INSET }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.8 }}
    >
      <header className="flex h-11 shrink-0 items-center gap-1 border-b border-line px-1.5">
        <button
          type="button"
          onClick={() => close(win.id)}
          aria-label="Back to home"
          className="flex items-center gap-0.5 rounded-md py-2 pr-2.5 pl-1 font-mono text-xs text-accent active:bg-white/5"
        >
          <ChevronLeft size={18} />
          home
        </button>
        <span className="flex-1 truncate text-center font-mono text-xs text-fg">{app.title}</span>
        {/* Balances the back button so the title sits optically centred. */}
        <span className="w-[68px]" />
      </header>

      <div className="os-scroll min-h-0 flex-1 overflow-auto overscroll-contain">
        <Body />
      </div>
    </motion.section>
  )
}
