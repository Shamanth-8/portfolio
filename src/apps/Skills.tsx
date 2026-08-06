import { motion } from 'motion/react'
import { SKILL_GROUPS } from '../data/skills'

export function Skills() {
  return (
    <div className="p-4 sm:p-5">
      <p className="font-mono text-[11px] text-ok">$ cat skills.json</p>

      <div className="mt-4 space-y-4">
        {SKILL_GROUPS.map((group, gi) => (
          <motion.section
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.07, duration: 0.35 }}
          >
            <div className="flex items-baseline gap-2">
              <h2 className="font-mono text-xs text-accent">{group.label}</h2>
              <span className="h-px flex-1 bg-line" />
            </div>
            <p className="mt-1 text-[11px] text-muted">{group.note}</p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {group.items.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: gi * 0.07 + i * 0.025, duration: 0.25 }}
                  whileHover={{ y: -2 }}
                  className="cursor-default rounded-md border border-line bg-bg/50 px-2 py-1 font-mono text-[11px] text-fg/80 transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
