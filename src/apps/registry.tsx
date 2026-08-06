import type { ComponentType } from 'react'
import { Folder, TerminalSquare } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { About } from './About'
import { Contact } from './Contact'
import { Experience } from './Experience'
import { Projects } from './Projects'
import { Skills } from './Skills'
import { Terminal } from './Terminal'

export type AppId = 'about' | 'experience' | 'projects' | 'skills' | 'terminal' | 'contact'

export interface AppDef {
  id: AppId
  /** Window title bar text. May be long. */
  title: string
  /** Desktop icon caption — must stay short enough not to wrap awkwardly. */
  short: string
  icon: LucideIcon
  width: number
  height: number
  component: ComponentType
}

export const APPS: Record<AppId, AppDef> = {
  about: {
    id: 'about',
    title: 'about.md',
    short: 'about.md',
    icon: Folder,
    width: 620,
    height: 460,
    component: About,
  },
  experience: {
    id: 'experience',
    title: 'experience.log',
    short: 'experience',
    icon: Folder,
    width: 720,
    height: 560,
    component: Experience,
  },
  projects: {
    id: 'projects',
    title: 'projects/',
    short: 'projects/',
    icon: Folder,
    width: 880,
    height: 600,
    component: Projects,
  },
  skills: {
    id: 'skills',
    title: 'skills.json',
    short: 'skills.json',
    icon: Folder,
    width: 700,
    height: 520,
    component: Skills,
  },
  terminal: {
    id: 'terminal',
    title: 'shamanth@dev-station: ~',
    short: 'terminal',
    icon: TerminalSquare,
    width: 720,
    height: 440,
    component: Terminal,
  },
  contact: {
    id: 'contact',
    title: 'contact.sh',
    short: 'contact.sh',
    icon: Folder,
    width: 520,
    height: 380,
    component: Contact,
  },
}

/**
 * Icon column order, and the GRUB entry order. Terminal leads — it is the way
 * in; the rest are folders you can also just open directly.
 */
export const DESKTOP_ORDER: AppId[] = [
  'terminal',
  'about',
  'experience',
  'projects',
  'skills',
  'contact',
]
