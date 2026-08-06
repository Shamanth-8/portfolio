import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Boot } from './os/Boot'
import { Desktop } from './os/Desktop'
import { Machine } from './os/Machine'
import { Reboot } from './os/Reboot'
import { hasBootedBefore, rememberBoot, useShell } from './os/shell'
import { useWindows } from './os/store'
import type { AppId } from './apps/registry'

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const setBooted = useShell((s) => s.setBooted)
  // Returning visitors and reduced-motion users land straight on the desktop.
  const [showBoot] = useState(() => !hasBootedBefore() && !reducedMotion())
  const [booting, setBooting] = useState(showBoot)

  useEffect(() => {
    if (!showBoot) setBooted(true)
  }, [showBoot, setBooted])

  const finish = useCallback(() => {
    setBooting(false)
    setBooted(true)
    rememberBoot()
  }, [setBooted])

  const rebooting = useShell((s) => s.rebooting)
  const setRebooting = useShell((s) => s.setRebooting)
  const open = useWindows((s) => s.open)

  // GRUB hands back whichever entry was selected; it opens on the fresh desktop.
  const finishReboot = useCallback(
    (appId: AppId) => {
      setRebooting(false)
      open(appId)
    },
    [setRebooting, open],
  )

  return (
    <Machine>
      <Desktop />
      <AnimatePresence>
        {booting && <Boot onDone={finish} />}
        {rebooting && <Reboot onDone={finishReboot} />}
      </AnimatePresence>
    </Machine>
  )
}
