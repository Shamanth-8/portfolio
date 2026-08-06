/**
 * Grouped skills, no percentage bars — nobody believes "React 87%", and every
 * line here maps to something in projects.ts or experience.ts.
 */
export interface SkillGroup {
  id: string
  label: string
  note: string
  items: string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    note: 'Daily drivers first.',
    items: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'HTML/CSS'],
  },
  {
    id: 'ml',
    label: 'ML & Deep Learning',
    note: 'From graph neural nets to transformers written from scratch.',
    items: [
      'PyTorch',
      'PyTorch Geometric',
      'GraphSAGE / GNNs',
      'TensorFlow',
      'Keras',
      'Scikit-learn',
      'Hugging Face Transformers',
      'NLTK',
      'OpenCV',
      'SHAP',
    ],
  },
  {
    id: 'genai',
    label: 'NLP & GenAI',
    note: 'RAG pipelines and multi-agent orchestration in production.',
    items: [
      'LangChain / LCEL',
      'FAISS',
      'FastEmbed',
      'RAG',
      'Groq',
      'Google Gemini API',
      'Anthropic Claude API',
      'VADER',
      'Prompt engineering',
      'LLM security',
    ],
  },
  {
    id: 'data',
    label: 'Data & Visualisation',
    note: 'Analysis through to the dashboard someone actually reads.',
    items: [
      'Pandas',
      'NumPy',
      'Power BI',
      'Tableau',
      'Plotly',
      'Matplotlib',
      'Seaborn',
      'Excel (PivotTables, Power Query)',
      'Financial risk metrics (Sharpe, VaR, drawdown)',
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    note: 'Services, interfaces and the contracts between them.',
    items: [
      'FastAPI',
      'Node.js',
      'Express',
      'REST API design',
      'React',
      'Next.js 14',
      'Vite',
      'Streamlit',
      'Flask',
      'Microservices',
      'System design',
    ],
  },
  {
    id: 'data-stores',
    label: 'Data Stores & Queues',
    note: '',
    items: ['MongoDB', 'Mongoose', 'SQLite', 'Redis', 'BullMQ', 'Data warehousing', 'ETL'],
  },
  {
    id: 'devops',
    label: 'DevOps & Linux',
    note: 'Getting it off the laptop and keeping it up.',
    items: ['Docker', 'Docker Compose', 'Linux', 'Git / GitHub', 'Render.com', 'Postman', 'CI/CD'],
  },
  {
    id: 'practice',
    label: 'Practice',
    note: 'How the work gets run.',
    items: [
      'Agile / sprint planning',
      'Code review',
      'SDLC',
      'Jira',
      'A/B testing',
      'Statistical analysis',
      'Data structures & algorithms',
    ],
  },
]
