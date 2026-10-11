import { motion } from 'motion/react'
import { ACHIEVEMENTS, CERTIFICATIONS, EDUCATION, ROLES } from '../data/experience'

export function Experience() {
  return (
    <div className="p-4 sm:p-5">
      <p className="font-mono text-[11px] text-ok">$ cat experience.log</p>

      {ROLES.map((role, i) => (
        <motion.section
          key={role.company}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="mt-4 rounded-lg border border-line bg-bg/40 p-3.5"
        >
          <h2 className="font-mono text-sm text-fg">
            {role.title} <span className="text-accent">@ {role.company}</span>
          </h2>
          <p className="mt-1 text-[11px] text-muted">
            {role.summary} · {role.location}
          </p>

          <ul className="mt-3 space-y-1.5">
            {role.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-xs leading-relaxed text-fg/75">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {role.stack.map((tech) => (
              <span
                key={tech}
                className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>
      ))}

      <Block title="education">
        <p className="font-mono text-xs text-fg">{EDUCATION.degree}</p>
        <p className="mt-0.5 text-[11px] text-muted">{EDUCATION.school}</p>
        <p className="mt-0.5 font-mono text-[10px] text-muted">
          {EDUCATION.period}
        </p>
      </Block>

      <Block title="achievements">
        <div className="space-y-2.5">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.title}>
              <p className="font-mono text-xs text-fg">{a.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-fg/70">{a.detail}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="certifications">
        <ul className="space-y-1">
          {CERTIFICATIONS.map((c) => (
            <li key={c} className="flex gap-2 text-[11px] text-fg/70">
              <span className="text-ok">✓</span>
              {c}
            </li>
          ))}
        </ul>
      </Block>
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <div className="flex items-baseline gap-2">
        <h2 className="font-mono text-xs text-accent">{title}</h2>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="mt-2">{children}</div>
    </section>
  )
}
