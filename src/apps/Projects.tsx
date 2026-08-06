import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { DOMAINS, PROJECTS } from '../data/projects'
import type { Domain, Project } from '../data/projects'

type Filter = Domain | 'all'

export function Projects() {
  const [filter, setFilter] = useState<Filter>('all')
  const [openSlug, setOpenSlug] = useState<string | null>(PROJECTS[0].slug)

  const visible = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.domains.includes(filter))

  return (
    <div className="p-4 sm:p-5">
      <p className="font-mono text-[11px] text-ok">
        $ ls ~/projects {filter !== 'all' && <span className="text-muted">--domain={filter}</span>}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <FilterTab active={filter === 'all'} onClick={() => setFilter('all')} label="all" count={PROJECTS.length} />
        {DOMAINS.map((d) => (
          <FilterTab
            key={d.id}
            active={filter === d.id}
            onClick={() => setFilter(d.id)}
            label={d.label}
            count={PROJECTS.filter((p) => p.domains.includes(d.id)).length}
          />
        ))}
      </div>

      <motion.div layout className="mt-4 grid gap-2.5">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              open={openSlug === project.slug}
              onToggle={() => setOpenSlug(openSlug === project.slug ? null : project.slug)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function FilterTab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors"
      style={{
        borderColor: active ? 'var(--color-accent)' : 'var(--color-line)',
        color: active ? 'var(--color-accent)' : 'var(--color-muted)',
        background: active ? 'rgba(88,166,255,0.08)' : 'transparent',
      }}
    >
      {label}
      <span className="ml-1.5 opacity-50">{count}</span>
    </button>
  )
}

function ProjectCard({
  project,
  open,
  onToggle,
}: {
  project: Project
  open: boolean
  onToggle: () => void
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      className="overflow-hidden rounded-lg border bg-bg/40 transition-colors"
      style={{ borderColor: open ? 'rgba(88,166,255,0.4)' : 'var(--color-line)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-2.5 p-3 text-left hover:bg-white/[0.02]"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="mt-0.5 text-accent">
          <ChevronRight size={14} />
        </motion.span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-fg">{project.name}</span>
            {/* Cross-domain tags: shows at a glance that a project spans areas. */}
            {project.domains.slice(1).map((d) => (
              <span key={d} className="font-mono text-[9px] text-accent/60">
                +{d}
              </span>
            ))}
          </span>
          <span className="mt-1 block text-xs text-muted">{project.tagline}</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="border-t border-line/60 px-3 pt-3 pb-3.5 pl-9">
              <ul className="space-y-1.5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-xs leading-relaxed text-fg/75">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {(project.repo || project.demo) && (
                <div className="mt-3 flex gap-3">
                  {project.repo && <CardLink href={project.repo} label="source" />}
                  {project.demo && <CardLink href={project.demo} label="live" />}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function CardLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-1 font-mono text-[11px] text-accent hover:underline"
    >
      {label}
      <ExternalLink size={11} />
    </a>
  )
}
