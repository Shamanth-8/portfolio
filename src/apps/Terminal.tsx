import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { PROFILE } from '../data/profile'
import { DOMAINS, PROJECTS } from '../data/projects'
import type { Domain } from '../data/projects'
import { SKILL_GROUPS } from '../data/skills'
import { ROLES } from '../data/experience'
import { useWindows } from '../os/store'
import { useShell } from '../os/shell'
import type { AppId } from '../apps/registry'

interface Line {
  kind: 'in' | 'out'
  node: ReactNode
}

interface Ctx {
  args: string[]
  print: (node: ReactNode) => void
  clear: () => void
  closeAll: () => void
  reboot: () => void
  openApp: (id: AppId) => void
}

const OK = ({ children }: { children: ReactNode }) => <span className="text-ok">{children}</span>
const Dim = ({ children }: { children: ReactNode }) => <span className="text-muted">{children}</span>
const Acc = ({ children }: { children: ReactNode }) => <span className="text-accent">{children}</span>

const COMMANDS: Record<string, { help: string; run: (ctx: Ctx) => void }> = {
  help: {
    help: 'list available commands',
    run: ({ print }) =>
      print(
        <div className="space-y-0.5">
          {Object.entries(COMMANDS).map(([name, cmd]) => (
            <div key={name}>
              <Acc>{name.padEnd(12)}</Acc>
              <Dim>{cmd.help}</Dim>
            </div>
          ))}
        </div>,
      ),
  },

  whoami: {
    help: 'who is behind this site',
    run: ({ print }) =>
      print(
        <div>
          <div className="text-fg">{PROFILE.name}</div>
          <Dim>{PROFILE.role}</Dim>
        </div>,
      ),
  },

  ls: {
    help: 'list the desktop apps',
    run: ({ print }) =>
      print(
        <div className="flex flex-wrap gap-x-4">
          {['about', 'experience', 'projects', 'skills', 'contact'].map((f) => (
            <Acc key={f}>{f}</Acc>
          ))}
        </div>,
      ),
  },

  home: {
    help: 'reboot to the desktop (GRUB menu)',
    run: ({ closeAll, reboot }) => {
      closeAll()
      reboot()
    },
  },

  projects: {
    help: 'list projects — projects --domain=ai-ml',
    run: ({ args, print }) => {
      const flag = args.find((a) => a.startsWith('--domain='))?.split('=')[1] ?? args[0]
      const domain = DOMAINS.find((d) => d.id === flag)?.id as Domain | undefined
      if (flag && !domain) {
        print(
          <span className="text-yellow-500">
            unknown domain "{flag}" — try: {DOMAINS.map((d) => d.id).join(', ')}
          </span>,
        )
        return
      }
      const list = domain ? PROJECTS.filter((p) => p.domains.includes(domain)) : PROJECTS
      print(
        <div className="space-y-1">
          {list.map((p) => (
            <div key={p.slug}>
              <Acc>{p.name}</Acc>
              <Dim> — {p.tagline}</Dim>
            </div>
          ))}
          <Dim>
            {list.length} entries. Run <Acc>open projects</Acc> for the full case studies.
          </Dim>
        </div>,
      )
    },
  },

  skills: {
    help: 'print the skill groups',
    run: ({ args, print }) => {
      const groups = args[0]
        ? SKILL_GROUPS.filter((g) => g.id === args[0] || g.label.toLowerCase().includes(args[0]))
        : SKILL_GROUPS
      if (!groups.length) {
        print(<span className="text-yellow-500">no such group — try: {SKILL_GROUPS.map((g) => g.id).join(', ')}</span>)
        return
      }
      print(
        <div className="space-y-1">
          {groups.map((g) => (
            <div key={g.id}>
              <Acc>{g.label}</Acc>
              <Dim> · {g.items.join(', ')}</Dim>
            </div>
          ))}
        </div>,
      )
    },
  },

  open: {
    help: 'open an app or link — open projects | open github',
    run: ({ args, print, openApp }) => {
      const target = args[0]
      const links: Record<string, string> = {
        github: PROFILE.github,
        linkedin: PROFILE.linkedin,
        leetcode: PROFILE.leetcode,
      }
      const apps: AppId[] = ['about', 'experience', 'projects', 'skills', 'terminal', 'contact']

      if (apps.includes(target as AppId)) {
        openApp(target as AppId)
        print(<OK>opening {target}…</OK>)
      } else if (links[target]) {
        window.open(links[target], '_blank', 'noreferrer')
        print(<OK>launching {target} in a new tab…</OK>)
      } else {
        print(
          <span className="text-yellow-500">
            open: what? try {apps.join(', ')}, {Object.keys(links).join(', ')}
          </span>,
        )
      }
    },
  },

  experience: {
    help: 'current role',
    run: ({ print }) =>
      print(
        <div className="space-y-1">
          {ROLES.map((r) => (
            <div key={r.company}>
              <Acc>
                {r.title} @ {r.company}
              </Acc>
              <Dim> — {r.summary}</Dim>
            </div>
          ))}
          <Dim>
            Run <Acc>open experience</Acc> for the full log.
          </Dim>
        </div>,
      ),
  },

  contact: {
    help: 'how to reach me',
    run: ({ print }) => print(<Acc>{PROFILE.email}</Acc>),
  },

  neofetch: {
    help: 'system summary',
    run: ({ print }) =>
      print(
        <div className="flex gap-4">
          <pre className="text-accent leading-tight">{`┌─────────┐
│  >_     │
│         │
└─────────┘`}</pre>
          <div className="space-y-0.5">
            <div>
              <Acc>user</Acc> <Dim>{PROFILE.handle}@dev-station</Dim>
            </div>
            <div>
              <Acc>focus</Acc> <Dim>{PROFILE.role}</Dim>
            </div>
            <div>
              <Acc>projects</Acc> <Dim>{PROJECTS.length}</Dim>
            </div>
            <div>
              <Acc>shell</Acc> <Dim>portfolio-sh 1.0</Dim>
            </div>
          </div>
        </div>,
      ),
  },

  clear: { help: 'clear the scrollback', run: ({ clear }) => clear() },

  'sudo hire-me': {
    help: 'the only privileged operation',
    run: ({ print }) =>
      print(
        <div>
          <Dim>[sudo] password for recruiter: </Dim>
          <OK>authenticated.</OK>
          <div className="mt-1 text-fg">
            Request queued. Reply to <Acc>{PROFILE.email}</Acc> to confirm.
          </div>
        </div>,
      ),
  },
}

const BANNER: Line[] = [
  {
    kind: 'out',
    node: (
      <Dim>
        portfolio-sh 1.0 — type <Acc>help</Acc> for commands, <Acc>Tab</Acc> to complete.
      </Dim>
    ),
  },
]

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(BANNER)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIndex, setHistIndex] = useState(-1)
  const openApp = useWindows((s) => s.open)
  const closeAll = useWindows((s) => s.closeAll)
  const setRebooting = useShell((s) => s.setRebooting)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const submit = (raw: string) => {
    const input = raw.trim()
    const print = (node: ReactNode) => setLines((l) => [...l, { kind: 'out', node }])

    setLines((l) => [...l, { kind: 'in', node: input }])
    if (input) setHistory((h) => [input, ...h])
    setHistIndex(-1)

    if (!input) return

    // "sudo hire-me" is the one two-word command, so match it before splitting.
    const key = Object.keys(COMMANDS).find(
      (name) => input === name || input.startsWith(`${name} `),
    )
    const cmd = key ? COMMANDS[key] : undefined

    if (!cmd) {
      print(
        <span className="text-yellow-500">
          {input.split(' ')[0]}: command not found — try <Acc>help</Acc>
        </span>,
      )
      return
    }

    cmd.run({
      args: input.slice(key!.length).trim().split(/\s+/).filter(Boolean),
      print,
      clear: () => setLines([]),
      closeAll,
      reboot: () => setRebooting(true),
      openApp,
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(value)
      setValue('')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = Object.keys(COMMANDS).find((c) => c.startsWith(value) && value.length > 0)
      if (match) setValue(match)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIndex + 1, history.length - 1)
      if (history[next] !== undefined) {
        setHistIndex(next)
        setValue(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIndex - 1
      setHistIndex(next)
      setValue(next >= 0 ? (history[next] ?? '') : '')
    }
  }

  return (
    <div
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
      className="os-scroll h-full cursor-text overflow-auto bg-bg p-3 font-mono text-[11px] leading-[1.65] sm:text-xs"
    >
      {lines.map((line, i) => (
        <div key={i} className={line.kind === 'in' ? 'mt-1.5' : ''}>
          {line.kind === 'in' ? (
            <div>
              <Prompt />
              <span className="text-fg">{line.node}</span>
            </div>
          ) : (
            <div className="text-fg/80">{line.node}</div>
          )}
        </div>
      ))}

      <div className="mt-1.5 flex items-center">
        <Prompt />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          // Phone keyboards otherwise capitalise and autocorrect every command.
          autoCapitalize="none"
          autoCorrect="off"
          aria-label="terminal input"
          className="flex-1 bg-transparent text-fg caret-accent outline-none"
        />
      </div>
    </div>
  )
}

function Prompt() {
  return (
    <span className="mr-1.5 select-none">
      <span className="text-ok">{PROFILE.handle}@dev-station</span>
      <span className="text-muted">:</span>
      <span className="text-accent">~</span>
      <span className="text-muted">$</span>
    </span>
  )
}
