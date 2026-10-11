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
    location: 'Bengaluru, India',
    summary: 'AI SaaS that builds full websites, forms and databases from a single prompt.',
    bullets: [
      'Architected the company’s multi-agent AI system.',
      'Lead technical direction.',
    ],
    stack: ['Next.js 14', 'TypeScript', 'Node.js', 'LLM APIs', 'Redis', 'Jira'],
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
