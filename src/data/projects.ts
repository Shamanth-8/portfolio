export type Domain = 'ai-ml' | 'data' | 'backend' | 'frontend' | 'devops' | 'security'

export const DOMAINS: { id: Domain; label: string; blurb: string }[] = [
  { id: 'ai-ml', label: 'AI / ML', blurb: 'graph ML, transformers, RAG' },
  { id: 'data', label: 'Data / BI', blurb: 'risk analytics, dashboards' },
  { id: 'backend', label: 'Backend', blurb: 'APIs, services, data stores' },
  { id: 'frontend', label: 'Frontend', blurb: 'React, Streamlit surfaces' },
  { id: 'devops', label: 'DevOps', blurb: 'Docker, deploys, queues' },
  { id: 'security', label: 'Security', blurb: 'RCE patch, LLM hardening' },
]

export interface Project {
  slug: string
  name: string
  /** First entry is the primary domain; the rest make it show up in those filters. */
  domains: Domain[]
  tagline: string
  /** Lead with the outcome, not the tech. */
  highlights: string[]
  stack: string[]
  /** TODO: paste the exact repo URL — the button only renders once this is set. */
  repo?: string
  demo?: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'graph-fraud-detection',
    name: 'Graph-Based Financial Fraud Detection',
    domains: ['ai-ml', 'data', 'frontend'],
    tagline: 'GraphSAGE fraud classification with an auditable 0–100 risk score.',
    highlights: [
      'End-to-end graph ML pipeline over ~20,000 transactions and ~2,000 accounts: adversarial synthetic data generation, graph construction, node-level fraud classification, and a live 6-page Streamlit dashboard.',
      '3-layer GraphSAGE (PyTorch Geometric) enriched with 5 centrality metrics, Louvain community labels, z-score, velocity and Shannon entropy features — AUC-PR 0.97 and F1 0.96, a +31% lift over the Random Forest baseline (AUC-PR 0.74).',
      'Fused the GNN probability with quant risk signals into a calibrated 0–100 score, then added SHAP explainability via a surrogate Random Forest so every account shows its top-3 risk drivers in plain language.',
      'HSBC Hackathon finalist.',
    ],
    stack: ['Python', 'PyTorch Geometric', 'GraphSAGE', 'NetworkX', 'SHAP', 'Streamlit', 'Plotly'],
  },
  {
    slug: 'news-sentiment-analyzer',
    name: 'Financial News Sentiment Analyzer',
    domains: ['ai-ml', 'data', 'backend'],
    tagline: 'Real-time NLP sentiment plus a grounded RAG Q&A engine over live news.',
    highlights: [
      'Ingests NewsAPI and Finnhub across NSE/BSE and US equities, tracking sentiment polarity over 1,000+ daily articles with filterable headline tables.',
      'Production RAG Q&A: FastEmbed embeddings indexed in FAISS, queried through Groq LLM via LangChain LCEL, with source citations on every answer.',
      'Performance caching cut repeated API latency by ~60%.',
      'Shipped twice over — Streamlit Cloud for browser, Telegram bot (@Blackbuck_bot) for mobile.',
    ],
    stack: ['Python', 'LangChain LCEL', 'FAISS', 'FastEmbed', 'Groq', 'VADER', 'Streamlit'],
  },
  {
    slug: 'code-bunny',
    name: 'Code Bunny — AI Code Analysis Assistant',
    domains: ['ai-ml', 'backend', 'devops', 'security'],
    tagline: 'Static analysis feeding an LLM reviewer, hardened and containerised.',
    highlights: [
      'Parses structure with Python AST and cyclomatic complexity with Radon, then hands the enriched context to Gemini for review with contextual follow-up Q&A — the model reasons over facts, not raw source.',
      'Hardened the LLM integration with prompt-injection defences, exponential backoff and multi-model fallback, holding availability when the primary API rate-limits.',
      'FastAPI + Streamlit split behind a REST contract so the services scale independently; Docker Compose plus render.yaml gives one-command cloud deployment.',
      '13 production deployments and 3 outside contributors on GitHub.',
    ],
    stack: ['Python', 'FastAPI', 'Streamlit', 'Gemini API', 'Docker Compose', 'AST', 'Radon'],
  },
  {
    slug: 'vit-cifar10',
    name: 'Vision Transformer — CIFAR-10',
    domains: ['ai-ml'],
    tagline: 'A ViT built from first principles, no pretrained weights.',
    highlights: [
      'Patch tokenisation (4×4, 64 patches/image), positional encodings and a 6-layer, 6-head transformer (~11M params) written from scratch — multi-head self-attention, MLP blocks and layer norm all implemented by hand.',
      'Trained with AdamW, CosineAnnealingLR and mixed-precision AMP to ~78% test accuracy on CIFAR-10.',
      'Served through Flask with weights held in memory, so inference does not reload per request.',
    ],
    stack: ['Python', 'PyTorch', 'Flask'],
  },
  {
    slug: 'nse-sector-risk',
    name: 'NSE Sector Risk Analysis',
    domains: ['data'],
    tagline: 'Five years of sector risk, ranked by risk-adjusted return.',
    highlights: [
      'Quantitative analysis of 6 NSE sector indices over 1,236 trading days spanning the COVID-19 shock and the RBI rate-hike cycle.',
      'Engineered the risk metrics that matter — annualised Sharpe against the RBI repo benchmark, 30-day rolling volatility, maximum drawdown and correlation matrices — ranking Pharma first (Sharpe 0.92) and Banking as the highest-risk (47.9% max drawdown).',
      'Normalised SQLite warehouse (7 tables plus custom SQL views) feeding Power BI–ready exports.',
    ],
    stack: ['Python', 'Pandas', 'SQLite', 'Power BI', 'yfinance'],
  },
  {
    slug: 'ecommerce-sales-analysis',
    name: 'E-Commerce Sales Performance Analysis',
    domains: ['data'],
    tagline: 'Multi-year transactional data turned into prioritised recommendations.',
    highlights: [
      'SQL aggregations, window functions and Power Query transformations to surface revenue trends, regional gaps and category-level profitability.',
      'Executive Power BI dashboards tracking sales, margin, order volume and category mix with regional drill-down.',
      'Excel forecasting (moving averages, trend extrapolation) to flag downward trends ahead of quarterly reviews.',
    ],
    stack: ['SQL', 'Power BI', 'Power Query', 'Excel'],
  },
  {
    slug: 'typedrop',
    name: 'TypeDrop — Real-Time Text Sharing',
    domains: ['backend', 'frontend', 'devops'],
    tagline: 'Collaborative text sharing with debounced autosave.',
    highlights: [
      'Express + MongoDB persistence with debounced autosave, so editing stays smooth without hammering the database.',
      'RESTful endpoints (GET /content, POST /save) over Mongoose schemas built around efficient retrieval and upserts.',
      'Deployed to Render with environment-based MongoDB Atlas configuration and data-integrity testing.',
    ],
    stack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'EJS'],
  },
  {
    slug: 'url-shortener',
    name: 'URL Shortener',
    domains: ['frontend', 'backend', 'devops'],
    tagline: 'Monorepo full-stack app with a clean front/back split.',
    highlights: [
      'React (Vite) frontend and Express backend in one monorepo, separated by REST APIs for URL creation and short-code generation.',
      'Input validation and error handling throughout, with separation of concerns that lets either half scale on its own.',
      'Endpoint-tested with Postman and manual QA, deployed to Render with a responsive history-tracking UI.',
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'Nanoid'],
  },
  {
    slug: 'aden-hive-rce',
    name: 'Aden Hive — RCE Patch (Open Source)',
    domains: ['security'],
    tagline: 'Found and fixed a remote code execution hole in a production codebase.',
    highlights: [
      'Identified a critical RCE caused by unsafe eval() usage in a production open-source codebase.',
      'Replaced it with a secure AST-based expression evaluator — the fix keeps the feature, removes the arbitrary execution path.',
      'Pull request reviewed and merged to main.',
    ],
    stack: ['Python', 'AST', 'Secure code review'],
  },
]

export const byDomain = (domain: Domain) => PROJECTS.filter((p) => p.domains.includes(domain))
