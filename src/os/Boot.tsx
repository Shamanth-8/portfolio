import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PROFILE } from '../data/profile'
import { PROJECTS } from '../data/projects'

const PROJECT_COUNT = PROJECTS.length

/** systemd-style boot log — every unit here is something actually on the site. */
const LINES: [string, string][] = [
  ['', 'dev-station 6.9.0-arch1 (tty1)'],
  ['OK', 'Reached target Basic System'],
  ['OK', 'Mounted /home/shamanth'],
  ['OK', 'Started python3.12 runtime'],
  ['OK', 'Started node v22 runtime'],
  ['OK', 'Loading models: graphsage.pt, vit_cifar10.pt'],
  ['OK', 'Restored FAISS index (1,000+ documents)'],
  ['OK', 'Started docker.service'],
  ['OK', 'Started fastapi.service — listening :8000'],
  ['OK', 'Loaded nmap NSE scripts + bandit ruleset'],
  ['OK', `Mounted /projects (${PROJECT_COUNT} entries)`],
  ['OK', 'Started portfolio-wm.service'],
  ['', ''],
  ['', `login: ${PROFILE.handle}`],
]

const LINE_MS = 78

export function Boot({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0)
  const [phase, setPhase] = useState<'log' | 'welcome'>('log')
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shown >= LINES.length) {
      const t = setTimeout(() => setPhase('welcome'), 260)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShown((n) => n + 1), LINE_MS)
    return () => clearTimeout(t)
  }, [shown])

  useEffect(() => {
    if (phase !== 'welcome') return
    const t = setTimeout(onDone, 1500)
    return () => clearTimeout(t)
  }, [phase, onDone])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') onDone()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  // Keep the newest line in view on short screens.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [shown])

  return (
    <motion.div
      className="power-on absolute inset-0 z-[10001] bg-bg"
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.45 }}
    >
      <AnimatePresence mode="wait">
        {phase === 'log' ? (
          <motion.div
            key="log"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            ref={logRef}
            className="os-scroll h-full overflow-hidden p-5 font-mono text-[11px] leading-[1.7] sm:p-8 sm:text-xs"
          >
            {LINES.slice(0, shown).map(([status, text], i) => (
              <div key={i} className="flex gap-2">
                {status && (
                  <span className="shrink-0 text-muted">
                    [<span className="text-ok"> OK </span>]
                  </span>
                )}
                <span className={status ? 'text-fg/80' : 'text-muted'}>{text}</span>
              </div>
            ))}
            <span className="inline-block h-3 w-2 translate-y-0.5 animate-pulse bg-ok" />
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 14, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.06em' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-2xl font-medium sm:text-4xl"
            >
              {PROFILE.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="font-mono text-[11px] text-accent sm:text-xs"
            >
              {PROFILE.role}
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: 'easeInOut' }}
              className="h-px w-40 bg-linear-to-r from-transparent via-accent to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onDone}
        className="absolute right-4 bottom-4 rounded-md border border-line px-2.5 py-1 font-mono text-[10px] text-muted transition-colors hover:border-accent/60 hover:text-fg"
      >
        skip ⏎
      </button>
    </motion.div>
  )
}
