import { motion } from 'motion/react'
import { PROFILE } from '../data/profile'
import { EDUCATION } from '../data/experience'
import { DOMAINS, PROJECTS } from '../data/projects'

const BIO = [
  'Final-year B.Tech AI & ML student at M S Ramaiah University, currently Tech Lead and AI Engineer at Aakaario — where I architected a multi-agent pipeline that turns a single natural-language prompt into a deployable full-stack app.',
  'My work sits where models meet engineering: a GraphSAGE fraud detector scoring ~2,000 accounts with SHAP explanations behind every score, a RAG engine answering questions over live market news with citations, a Vision Transformer written from first principles. Each one shipped with an interface someone can actually use.',
  'I care about the parts that make a model trustworthy — explainability, prompt-injection defences, fallbacks when an API rate-limits — and about the deploy step that gets it in front of people.',
]

export function About() {
  return (
    <div className="p-5 sm:p-6">
      <p className="font-mono text-[11px] text-ok">$ whoami</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{PROFILE.name}</h1>
        <p className="mt-1 font-mono text-xs text-accent">{PROFILE.role}</p>
        <p className="mt-0.5 font-mono text-[11px] text-muted">
          {PROFILE.location} · {EDUCATION.degree.replace('B.Tech, ', 'B.Tech ')} · grad 2026
        </p>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-fg/75">
          {BIO.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DOMAINS.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="rounded-lg border border-line bg-bg/40 p-2.5"
            >
              <p className="font-mono text-[11px] text-fg">{d.label}</p>
              <p className="mt-0.5 text-[10px] text-muted">{d.blurb}</p>
              <p className="mt-1.5 font-mono text-[10px] text-accent">
                {PROJECTS.filter((p) => p.domains.includes(d.id)).length} projects
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
