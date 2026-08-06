export interface Role {
  company: string
  title: string
  location: string
  summary: string
  bullets: string[]
  stack: string[]
}

export const ROLES: Role[] = [
  {
    company: 'Aakaario',
    title: 'Tech Lead & AI Engineer',
    location: 'Bangalore, India',
    summary: 'Vibe-coding SaaS — full websites, forms and databases from one natural-language prompt.',
    bullets: [
      'Led the end-to-end MVP build, the product used to pitch early investors.',
      'Architected a multi-agent pipeline — Boss, Blueprint, Backend, Frontend and Deploy agents on Claude Sonnet/Haiku with BullMQ job queues — producing deployable Node.js/TypeScript full-stack apps.',
      'Built the code and UI generation engine: plain-English prompts to production-ready, brand-matched frontend components with real-time preview and one-click deploy.',
      'Owned backend infrastructure and Next.js 14 frontend architecture while running a cross-functional team of 2 interns through sprint planning and Jira epics.',
      'Turned demo and onboarding feedback into prioritised feature requirements, and kept stakeholders aligned on timelines and milestones.',
    ],
    stack: ['Next.js 14', 'TypeScript', 'Node.js', 'Claude API', 'BullMQ', 'Redis', 'Jira'],
  },
]

export const EDUCATION = {
  school: 'M S Ramaiah University of Applied Sciences',
  degree: 'B.Tech, Artificial Intelligence and Machine Learning',
  period: 'Aug 2022 – Jun 2026',
  detail: 'CGPA 7.5 / 10 · Bangalore, India',
}

export const ACHIEVEMENTS = [
  {
    title: 'HSBC Hackathon Finalist',
    detail:
      'Finalist for the graph-based fraud detection and risk analytics system, built under competitive time constraints.',
  },
  {
    title: 'Open Source Security Contribution — Aden Hive',
    detail:
      'Patched a critical RCE from unsafe eval() usage; replaced it with an AST-based evaluator. PR merged to main.',
  },
  {
    title: 'Chess Club Coordinator, M S Ramaiah University',
    detail: 'Revived the club from near-dormancy to 100+ active members.',
  },
]

export const CERTIFICATIONS = [
  'NoSQL, Big Data and Spark Foundations — Coursera',
  'Generative AI for Software Developers — Coursera',
  'Data Science: Essential Math — Coursera',
]
