# portfolio-os

My portfolio, built as a desktop operating system running inside a CRT monitor.

Instead of a scrolling page, the site boots: a systemd-style log streams past, the desktop
fades in, and each section is a draggable window you open from the icon column — or from a
terminal that actually parses commands.

**Live:** _add your URL here after deploying_

---

## What's in it

| Piece                    | What it does                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| **Boot sequence**        | CRT power-on flash, then a systemd-style log naming the real stack, then a title card         |
| **Window manager**       | Open, focus, drag, resize, minimize, maximize; z-ordering; cascade placement                  |
| **Terminal**             | `help`, `whoami`, `projects --domain=ai-ml`, `open github`, `neofetch`, `sudo hire-me`, …     |
| **GRUB reboot**          | The Home button reboots the machine — boot menu, welcome card, back to the desktop            |
| **Immersive mode**       | "Step inside" sheds the monitor bezel so the screen fills the viewport                        |

Everything on screen is driven by plain data files, so updating the site never means touching
a component.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** — theme tokens live in `src/index.css` under `@theme`
- **Motion** — window springs, boot stagger, the header light sweep
- **Zustand** — window manager and shell state
- **lucide-react** — icons

No UI kit, no animation library beyond Motion, no `xterm.js`. The terminal is a controlled
input plus a command map.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
npm run preview  # serve the built output
npm run lint
```

## Project layout

```
src/
├─ os/                  the operating system itself
│  ├─ store.ts          window manager (Zustand) — geometry, z-order, focus
│  ├─ shell.ts          boot / reboot / immersive-mode state
│  ├─ Machine.tsx       the CRT: bezel, stand, screen, ResizeObserver
│  ├─ Desktop.tsx       wallpaper, icon column, window layer
│  ├─ Window.tsx        window chrome — drag, resize, traffic lights
│  ├─ TopBar.tsx        header: running apps, profile links, Home
│  ├─ Boot.tsx          first-load boot log + title card
│  └─ Reboot.tsx        GRUB menu + welcome card
├─ apps/                one component per window
│  ├─ registry.tsx      the app table — id, title, icon, default size
│  ├─ Terminal.tsx      command parser and scrollback
│  └─ About / Experience / Projects / Skills / Contact
└─ data/                all content lives here
   ├─ profile.ts        name, links, contact details
   ├─ projects.ts       projects and their domains
   ├─ skills.ts         grouped skills
   
   └─ experience.ts     roles, education, achievements, certifications
```

### The window manager

Windows are measured against the **screen element**, not the browser viewport — a
`ResizeObserver` in `Machine.tsx` feeds `screen` into the store. That is what lets the same
desktop behave correctly framed inside the monitor and expanded full-bleed, and what keeps
open windows re-fitting instead of stranding themselves off-screen.

### Adding a section

1. Write the component in `src/apps/`.
2. Add an entry to `APPS` in `src/apps/registry.tsx` (id, title, short caption, icon, default size).
3. Add its id to `DESKTOP_ORDER`.

The icon column, the taskbar, the terminal's `open` command and the GRUB boot menu all read
from that table, so nothing else needs editing.

33 outlook

<img width="1894" height="907" alt="image" src="https://github.com/user-attachments/assets/b77f10ba-ee64-4ca9-94b6-a90c50d81175" />
