import { AnimatePresence, motion } from 'motion/react'
import { APPS, DESKTOP_ORDER } from '../apps/registry'
import type { AppId } from '../apps/registry'
import { PROFILE } from '../data/profile'
import { MobileSheet } from './MobileSheet'
import { TopBar } from './TopBar'
import { Window } from './Window'
import { useShell } from './shell'
import { useIsMobile } from './useIsMobile'
import { useWindows } from './store'

export function Desktop() {
  const windows = useWindows((s) => s.windows)
  const open = useWindows((s) => s.open)
  const booted = useShell((s) => s.booted)
  const isMobile = useIsMobile()

  // On mobile only the front-most sheet is on screen; the rest stay in the
  // store so closing one reveals whatever was under it.
  const front = windows.filter((w) => !w.minimized).sort((a, b) => a.z - b.z).at(-1)

  return (
    <div className="wallpaper absolute inset-0 overflow-hidden bg-bg">
      <TopBar />

      {isMobile ? (
        <>
          <MobileHome booted={booted} onOpen={open} />
          <AnimatePresence>
            {front && <MobileSheet key={front.id} win={front} />}
          </AnimatePresence>
        </>
      ) : (
        <>
          <div className="absolute top-12 left-2 flex flex-col gap-0.5 sm:left-3">
            {DESKTOP_ORDER.map((id, i) => (
              <DesktopIcon key={id} appId={id} index={i} booted={booted} onOpen={() => open(id)} />
            ))}
          </div>

          {/* First-run cue: fades out as soon as anything is open. */}
          <AnimatePresence>
            {booted && windows.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.4, duration: 0.6 } }}
                // Exit must not inherit the entrance delay, or the hint lingers
                // for over a second after the first window opens.
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="pointer-events-none absolute inset-x-0 bottom-6 text-center font-mono text-[11px] text-muted/70"
              >
                open an app — or run <span className="text-accent">terminal</span> and type{' '}
                <span className="text-ok">help</span>
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {windows.map((win) => (
              <Window key={win.id} win={win} />
            ))}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

/** Phone home screen: who you are, then a grid of apps. */
function MobileHome({ booted, onOpen }: { booted: boolean; onOpen: (id: AppId) => void }) {
  return (
    <div className="absolute inset-x-0 top-9 bottom-0 overflow-y-auto px-5 pt-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={booted ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-xl font-semibold tracking-tight">{PROFILE.name}</h1>
        <p className="mt-1 font-mono text-[11px] text-accent">{PROFILE.role}</p>
        <p className="mt-0.5 font-mono text-[10px] text-muted">{PROFILE.location}</p>
      </motion.div>

      <div className="mt-7 grid grid-cols-3 gap-2">
        {DESKTOP_ORDER.map((id, i) => {
          const app = APPS[id]
          const Icon = app.icon
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onOpen(id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={booted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{
                delay: 0.15 + i * 0.05,
                type: 'spring',
                stiffness: 340,
                damping: 26,
              }}
              whileTap={{ scale: 0.94 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface/60 px-1 py-4 active:border-accent/60"
            >
              <span className="text-accent">
                <Icon size={24} />
              </span>
              <span className="w-full truncate px-1 text-center font-mono text-[10px] text-muted">
                {app.short}
              </span>
            </motion.button>
          )
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={booted ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-7 text-center font-mono text-[10px] leading-relaxed text-muted/70"
      >
        tap <span className="text-accent">terminal</span> and type{' '}
        <span className="text-ok">help</span> — it runs real commands
      </motion.p>
    </div>
  )
}

function DesktopIcon({
  appId,
  index,
  booted,
  onOpen,
}: {
  appId: AppId
  index: number
  booted: boolean
  onOpen: () => void
}) {
  const app = APPS[appId]
  const Icon = app.icon
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, x: -14 }}
      animate={booted ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
      transition={{ delay: 0.25 + index * 0.07, type: 'spring', stiffness: 320, damping: 26 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="group flex w-[84px] flex-col items-center gap-1 rounded-lg p-1.5 transition-colors hover:bg-white/5"
    >
      <span className="rounded-lg border border-line bg-surface p-2 text-accent transition-all group-hover:border-accent/60 group-hover:shadow-[0_0_18px_-4px_var(--color-accent)]">
        <Icon size={20} />
      </span>
      <span className="w-full truncate font-mono text-[10px] text-muted transition-colors group-hover:text-fg">
        {app.short}
      </span>
    </motion.button>
  )
}
