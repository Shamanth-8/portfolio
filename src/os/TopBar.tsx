import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { House, SquareCode } from 'lucide-react'
import { APPS } from '../apps/registry'
import { PROFILE } from '../data/profile'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import type { IconProps } from './BrandIcons'
import { useShell } from './shell'
import { useWindows } from './store'

const LINKS: { href: string; label: string; icon: ComponentType<IconProps> }[] = [
  { href: PROFILE.github, label: 'GitHub', icon: GithubIcon },
  { href: PROFILE.leetcode, label: 'LeetCode', icon: SquareCode },
  { href: PROFILE.linkedin, label: 'LinkedIn', icon: LinkedinIcon },
]

export function TopBar() {
  const windows = useWindows((s) => s.windows)
  const activeId = useWindows((s) => s.activeId)
  const focus = useWindows((s) => s.focus)
  const booted = useShell((s) => s.booted)
  const clock = useClock()

  return (
    <header className="absolute inset-x-0 top-0 z-[9999] flex h-9 items-center gap-2 border-b border-line bg-surface/80 px-2 backdrop-blur sm:gap-3 sm:px-3">
      <span className="hidden font-mono text-xs font-medium text-fg sm:inline">
        {PROFILE.handle}
        <span className="text-muted">@dev-station</span>
      </span>

      {/* Running apps — minimized windows come back from here. */}
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
        {windows.map((win) => {
          const app = APPS[win.appId]
          const Icon = app.icon
          const active = win.id === activeId && !win.minimized
          return (
            <button
              key={win.id}
              type="button"
              onClick={() => focus(win.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] transition-colors hover:bg-white/5"
              style={{
                color: active ? 'var(--color-accent)' : 'var(--color-muted)',
                background: active ? 'rgba(88,166,255,0.08)' : undefined,
              }}
            >
              <Icon size={12} />
              <span className="hidden max-w-[120px] truncate sm:inline">{app.title}</span>
              {win.minimized && <span className="text-[9px] opacity-60">▾</span>}
            </button>
          )
        })}
      </div>

      <LinkRail booted={booted} />

      <span className="hidden font-mono text-xs tabular-nums text-muted sm:inline">{clock}</span>
    </header>
  )
}

/**
 * The profile links, deliberately the loudest thing in the chrome: they get a
 * tinted rail, a staggered entrance and two shine passes once the desktop is up.
 */
function LinkRail({ booted }: { booted: boolean }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={booted ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="relative flex items-center gap-0.5 overflow-hidden rounded-lg border border-accent/25 bg-accent/[0.06] px-1 py-0.5"
    >
      {LINKS.map((link, i) => (
        <RailLink key={link.label} {...link} index={i} booted={booted} />
      ))}
      <HomeButton index={LINKS.length} booted={booted} />

      {/* Light sweep: draws the eye here twice, then leaves it alone. */}
      {booted && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-14 bg-linear-to-r from-transparent via-white/12 to-transparent"
          initial={{ x: '-120%' }}
          animate={{ x: '520%' }}
          transition={{ duration: 1.1, delay: 1, repeat: 2, repeatDelay: 3.2, ease: 'easeInOut' }}
        />
      )}
    </motion.nav>
  )
}

/**
 * Home clears every open window and returns to the bare desktop — the way back
 * out of any section, always in the same place in the header.
 */
function HomeButton({ index, booted }: { index: number; booted: boolean }) {
  const closeAll = useWindows((s) => s.closeAll)
  const openCount = useWindows((s) => s.windows.length)
  const setRebooting = useShell((s) => s.setRebooting)

  // Home is a reboot: clear the desk, then GRUB → welcome → back to the desktop.
  const goHome = () => {
    closeAll()
    setRebooting(true)
  }

  return (
    <motion.button
      type="button"
      onClick={goHome}
      aria-label="Home — reboot to the desktop"
      title="Home — reboot to the desktop"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={booted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ delay: 0.35 + index * 0.09, type: 'spring', stiffness: 420, damping: 24 }}
      // Named variant rather than an inline object so `hover` propagates to the
      // icon below and the roof lifts with the button.
      whileHover="hover"
      whileTap={{ scale: 0.94 }}
      variants={{ hover: { y: -1 } }}
      className="flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-[11px] text-fg/80 transition-colors hover:bg-accent/15 hover:text-accent"
    >
      <motion.span
        className="relative flex"
        variants={{ hover: { y: -1.5, rotate: -8 } }}
        transition={{ type: 'spring', stiffness: 500, damping: 12 }}
      >
        <House size={13} />
      </motion.span>
      <span className="hidden md:inline">Home</span>
      {/* Quiet count of what Home would clear — no windows, no dot. */}
      <AnimatePresence>
        {openCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 22 }}
            className="h-1.5 w-1.5 rounded-full bg-accent"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function RailLink({
  href,
  label,
  icon: Icon,
  index,
  booted,
}: {
  href: string
  label: string
  icon: ComponentType<IconProps>
  index: number
  booted: boolean
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={booted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ delay: 0.35 + index * 0.09, type: 'spring', stiffness: 420, damping: 24 }}
      whileHover={{ y: -1 }}
      className="flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-[11px] text-fg/80 transition-colors hover:bg-accent/15 hover:text-accent"
    >
      <Icon size={13} />
      <span className="hidden md:inline">{label}</span>
    </motion.a>
  )
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
