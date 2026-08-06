import { useRef } from 'react'
import { motion } from 'motion/react'
import { APPS } from '../apps/registry'
import { useWindows } from './store'
import type { WindowState } from './store'

interface Props {
  win: WindowState
}

export function Window({ win }: Props) {
  const app = APPS[win.appId]
  const Body = app.component
  // Selected individually: dragging writes to the store ~60×/s, and destructuring
  // the whole store would re-render every open window on each of those writes.
  const close = useWindows((s) => s.close)
  const focus = useWindows((s) => s.focus)
  const minimize = useWindows((s) => s.minimize)
  const toggleMaximize = useWindows((s) => s.toggleMaximize)
  const move = useWindows((s) => s.move)
  const resize = useWindows((s) => s.resize)
  const isActive = useWindows((s) => s.activeId === win.id)

  // Pointer offset captured on drag/resize start, so motion is relative.
  const grab = useRef({ dx: 0, dy: 0, w: 0, h: 0 })

  const startDrag = (e: React.PointerEvent) => {
    if (win.maximized) return
    e.currentTarget.setPointerCapture(e.pointerId)
    grab.current = { dx: e.clientX - win.x, dy: e.clientY - win.y, w: 0, h: 0 }
  }

  const onDrag = (e: React.PointerEvent) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    move(win.id, e.clientX - grab.current.dx, e.clientY - grab.current.dy)
  }

  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    grab.current = { dx: e.clientX, dy: e.clientY, w: win.w, h: win.h }
  }

  const onResize = (e: React.PointerEvent) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    const { dx, dy, w, h } = grab.current
    resize(win.id, w + (e.clientX - dx), h + (e.clientY - dy))
  }

  const endPointer = (e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <motion.section
      role="dialog"
      aria-label={app.title}
      aria-hidden={win.minimized}
      className="absolute flex flex-col overflow-hidden rounded-xl border bg-surface shadow-2xl shadow-black/60"
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        borderColor: isActive ? 'var(--color-accent)' : 'var(--color-line)',
        pointerEvents: win.minimized ? 'none' : 'auto',
      }}
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: win.minimized ? 0.9 : 1,
        y: win.minimized ? 24 : 0,
      }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.14 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
      onPointerDown={() => focus(win.id)}
    >
      <header
        className="flex h-9 shrink-0 cursor-grab items-center gap-2 border-b border-line px-3 select-none active:cursor-grabbing"
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="flex items-center gap-2">
          <TrafficLight color="#ff5f57" label="Close" onClick={() => close(win.id)} />
          <TrafficLight color="#febc2e" label="Minimize" onClick={() => minimize(win.id)} />
          <TrafficLight color="#28c840" label="Maximize" onClick={() => toggleMaximize(win.id)} />
        </div>
        <span
          className="pointer-events-none flex-1 truncate text-center font-mono text-xs"
          style={{ color: isActive ? 'var(--color-fg)' : 'var(--color-muted)' }}
        >
          {app.title}
        </span>
        {/* Balances the traffic lights so the title sits optically centred. */}
        <div className="w-[52px]" />
      </header>

      <div className="os-scroll min-h-0 flex-1 overflow-auto">
        <Body />
      </div>

      {!win.maximized && (
        <div
          className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize"
          onPointerDown={startResize}
          onPointerMove={onResize}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
        />
      )}
    </motion.section>
  )
}

function TrafficLight({
  color,
  label,
  onClick,
}: {
  color: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="h-3 w-3 rounded-full transition-transform hover:scale-110"
      style={{ background: color }}
      // Stop the drag handler from claiming the pointer before the click lands.
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
    />
  )
}
