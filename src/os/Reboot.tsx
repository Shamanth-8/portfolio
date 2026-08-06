import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { APPS, DESKTOP_ORDER } from '../apps/registry'
import type { AppId } from '../apps/registry'
import { PROFILE } from '../data/profile'

/** Seconds before the highlighted entry boots on its own. */
const COUNTDOWN = 3

/** Terminal is entry 0; everything else is presented as a folder. */
const ENTRIES = DESKTOP_ORDER.map((id) => ({
  id,
  // The app id makes a cleaner folder name than the filename-style caption.
  label: id === 'terminal' ? 'Portfolio Terminal' : `${id}/`,
}))

export function Reboot({ onDone }: { onDone: (boot: AppId) => void }) {
  const [selected, setSelected] = useState(0)
  const [left, setLeft] = useState(COUNTDOWN)
  const [phase, setPhase] = useState<'grub' | 'welcome'>('grub')
  const [booting, setBooting] = useState<AppId>(ENTRIES[0].id)

  const boot = useCallback((index: number) => {
    setBooting(ENTRIES[index].id)
    setPhase('welcome')
  }, [])

  // Countdown auto-boots the highlighted entry, exactly like a real menu.
  useEffect(() => {
    if (phase !== 'grub') return
    if (left <= 0) {
      boot(selected)
      return
    }
    const t = setTimeout(() => setLeft((n) => n - 1), 900)
    return () => clearTimeout(t)
  }, [left, phase, selected, boot])

  useEffect(() => {
    if (phase !== 'welcome') return
    const t = setTimeout(() => onDone(booting), 1400)
    return () => clearTimeout(t)
  }, [phase, booting, onDone])

  useEffect(() => {
    if (phase !== 'grub') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setLeft(COUNTDOWN) // Any interaction cancels the auto-boot, as GRUB does.
        setSelected((i) => (i + 1) % ENTRIES.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setLeft(COUNTDOWN)
        setSelected((i) => (i - 1 + ENTRIES.length) % ENTRIES.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        boot(selected)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, selected, boot])

  return (
    <motion.div
      className="absolute inset-0 z-[10001] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.25 }}
    >
      <AnimatePresence mode="wait">
        {phase === 'grub' ? (
          <motion.div
            key="grub"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex h-full flex-col items-center justify-center px-4 font-mono text-[11px] sm:text-xs"
          >
            <p className="mb-3 text-muted">GNU GRUB version 2.12</p>

            <div className="w-full max-w-[520px] border border-line">
              {ENTRIES.map((entry, i) => {
                const active = i === selected
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onMouseEnter={() => {
                      setLeft(COUNTDOWN)
                      setSelected(i)
                    }}
                    onClick={() => boot(i)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors"
                    style={{
                      background: active ? 'var(--color-accent)' : 'transparent',
                      color: active ? '#0b0e12' : 'var(--color-fg)',
                    }}
                  >
                    <span className="opacity-70">{entry.id === 'terminal' ? '>_' : '::'}</span>
                    {entry.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 w-full max-w-[520px] space-y-1 text-muted">
              <p>Use the ↑ and ↓ keys to select which entry is highlighted.</p>
              <p>
                Press enter to boot the selected OS. The highlighted entry will be executed
                automatically in <span className="text-fg">{left}s</span>.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-[11px] tracking-[0.35em] text-muted uppercase"
            >
              welcome
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.05em' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xl font-medium sm:text-3xl"
            >
              this is {PROFILE.name.split(' ')[0]}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: 'easeInOut' }}
              className="h-px w-40 bg-linear-to-r from-transparent via-accent to-transparent"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-1 font-mono text-[10px] text-muted"
            >
              starting {APPS[booting].title}…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
