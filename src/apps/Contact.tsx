import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import { Mail, MapPin, Phone, SquareCode } from 'lucide-react'
import { PROFILE } from '../data/profile'
import { GithubIcon, LinkedinIcon } from '../os/BrandIcons'
import type { IconProps } from '../os/BrandIcons'

// Widened past LucideIcon so the hand-rolled brand marks fit the same slot.
const ROWS: { label: string; value: string; href?: string; icon: ComponentType<IconProps> }[] = [
  { label: 'email', value: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: Mail },
  { label: 'phone', value: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s/g, '')}`, icon: Phone },
  { label: 'location', value: PROFILE.location, icon: MapPin },
  { label: 'github', value: 'github.com/Shamanth-8', href: PROFILE.github, icon: GithubIcon },
  { label: 'linkedin', value: 'shamanth-patel', href: PROFILE.linkedin, icon: LinkedinIcon },
  { label: 'leetcode', value: 'Shamanthpatel', href: PROFILE.leetcode, icon: SquareCode },
]

export function Contact() {
  return (
    <div className="p-5">
      <p className="font-mono text-[11px] text-ok">$ ./contact.sh</p>
      <p className="mt-3 text-xs text-muted">
        Open to AI/ML, data and full-stack roles. Fastest reply is email.
      </p>

      <div className="mt-4 space-y-1.5">
        {ROWS.map((row, i) => {
          const Icon = row.icon
          const inner = (
            <>
              <span className="text-accent">
                <Icon size={14} />
              </span>
              <span className="w-16 shrink-0 font-mono text-[11px] text-muted">{row.label}</span>
              <span className="truncate font-mono text-[11px] text-fg/85">{row.value}</span>
            </>
          )
          const className =
            'flex items-center gap-3 rounded-lg border border-line bg-bg/40 px-3 py-2.5 transition-colors'

          return (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              {row.href ? (
                <a
                  href={row.href}
                  target={row.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer noopener"
                  className={`${className} hover:border-accent/60`}
                >
                  {inner}
                </a>
              ) : (
                <div className={className}>{inner}</div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
