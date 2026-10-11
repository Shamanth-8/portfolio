export type Domain = 'ai-ml' | 'data' | 'backend' | 'frontend' | 'devops' | 'security'

export const DOMAINS: { id: Domain; label: string; blurb: string }[] = [
  { id: 'ai-ml', label: 'AI / ML', blurb: 'agents, RAG, graph ML' },
  { id: 'data', label: 'Data / BI', blurb: 'risk analytics, dashboards' },
  { id: 'backend', label: 'Backend', blurb: 'APIs, services, data stores' },
  { id: 'frontend', label: 'Frontend', blurb: 'React, Streamlit surfaces' },
  { id: 'devops', label: 'DevOps', blurb: 'Docker, deploys, queues' },
  { id: 'security', label: 'Security', blurb: 'AppSec, vuln scanning, threat intel' },
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
  repo?: string
  demo?: string
}

const GH = 'https://github.com/Shamanth-8'

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
    repo: `${GH}/fraud-detection`,
  },
  {
    slug: 'reggraph',
    name: 'RegGraph — Agentic SEBI Compliance',
    domains: ['ai-ml', 'backend', 'data'],
    tagline: 'SEBI circulars in, auditable compliance obligations out.',
    highlights: [
      'Turns unstructured SEBI circulars into structured obligations — severity, deadline, owner and required evidence — then generates action items per intermediary and role.',
      'A local TF-IDF + logistic-regression model extracts obligations offline in ~1s: precision 1.00 / recall 0.93 on held-out circulars, and 1,391 obligations from the unseen 399-page Stock Broker Master Circular in 7s.',
      'LLM agents enrich the local results and run a semantic diff (NEW / MODIFIED / SUPERSEDED, naming the changed field); a NetworkX graph propagates impact to dependent obligations.',
      'Degrades gracefully — with the LLM provider down, the pipeline still returns every obligation, with a timestamped audit trail.',
    ],
    stack: ['Python', 'scikit-learn', 'FastAPI', 'Streamlit', 'NetworkX', 'FAISS', 'OpenRouter'],
    repo: `${GH}/SEBI`,
  },
  {
    slug: 'tradeo',
    name: 'Tradeo — Local-First AI Market Lab',
    domains: ['ai-ml', 'backend', 'frontend', 'data'],
    tagline: 'Open-source paper-trading lab for Indian markets, running on a laptop LLM.',
    highlights: [
      'Chat or talk to a local LLM (Ollama, Whisper in, Piper out) that scans NSE/BSE, reviews picks and runs intraday, swing and daily-pick agents on a virtual ₹10 lakh account with realistic Indian charges.',
      'Experimental RL trader built on the fruit fly’s mushroom-body connectome (6,293 neurons from FlyWire), learning from dopamine-style reward-prediction error on every closed trade.',
      'Honest by design: every strategy shows its backtest after charges against random picks, and stops, targets and sizing are computed in code — never by the language model.',
      'FastAPI + React/Vite, pluggable LLMs, data sources and brokers; 55 pytest tests and GitHub Actions CI on every push.',
    ],
    stack: ['Python', 'FastAPI', 'React', 'Ollama', 'scikit-learn', 'DuckDB', 'GitHub Actions'],
    repo: `${GH}/tradeo`,
  },
  {
    slug: 'vuln-scanner',
    name: 'Automated Vulnerability Scanner',
    domains: ['security', 'devops'],
    tagline: 'Nmap NSE recon to a CVSS-scored, client-ready report in one command.',
    highlights: [
      'Wraps Nmap’s scripting engine with ~25 curated NSE checks — SQLi, XSS, Shellshock, Heartbleed, EternalBlue, weak SSH/FTP/MySQL credentials — and maps every finding to a CVSS score and a remediation step.',
      'Generates HTML and PDF reports (Jinja2 + WeasyPrint) and posts a Slack summary, turning hours of manual recon into a single run.',
      'Weekly GitHub Actions scan acts as a security gate: exit code 2 on critical findings fails the pipeline and fires alerts.',
    ],
    stack: ['Python', 'Nmap / NSE', 'CVSS', 'Jinja2', 'WeasyPrint', 'pytest', 'GitHub Actions'],
    repo: `${GH}/vuln-scanner`,
  },
  {
    slug: 'secure-webapp',
    name: 'Secure Web App + SAST Pipeline',
    domains: ['security', 'backend', 'devops'],
    tagline: 'Broke a Flask app across the OWASP Top 10, then fixed and hardened it.',
    highlights: [
      'Built an intentionally vulnerable Flask app and a fixed twin: SQL/command injection, XSS, IDOR, SSRF, MD5 passwords and session fixation, each patched with an annotated fix.',
      'Controls: parameterised queries, bcrypt (cost 12), CSRF tokens, bleach sanitisation, rate limiting, SSRF allowlisting, security headers and auth-event logging.',
      'SAST on every push — Bandit, pip-audit and gitleaks, with SARIF results in the GitHub Security tab.',
      'Hardened Docker deploy behind Nginx TLS and Gunicorn: non-root user, read-only filesystem, all capabilities dropped, isolated internal network.',
    ],
    stack: ['Python', 'Flask', 'Bandit', 'gitleaks', 'Docker', 'Nginx', 'GitHub Actions'],
    repo: `${GH}/secure-webapp`,
  },
  {
    slug: 'threat-intel-dashboard',
    name: 'Threat Intelligence Dashboard',
    domains: ['security', 'ai-ml', 'data'],
    tagline: 'IOC aggregation with ML anomaly detection for SOC triage.',
    highlights: [
      'Ingests IOCs from AbuseIPDB, abuse.ch, Shodan and HIBP into a normalised SQLite store, deduplicating across feeds and keeping the highest-confidence record.',
      'Enriches each IOC with GeoIP, reverse DNS and cross-source corroboration, then flags unusual indicators with an Isolation Forest model.',
      'Streamlit analyst workflow: triage anomalies by score, mark as reviewed or escalate, export to CSV — with a mock mode for demoing without paid feeds.',
    ],
    stack: ['Python', 'scikit-learn', 'Pandas', 'SQLite', 'Streamlit', 'pytest'],
    repo: `${GH}/threat-intel-dashboard`,
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
    repo: 'https://github.com/aden-hive/hive/pull/402',
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
    repo: `${GH}/stocksenti`,
    demo: 'https://stocksenti-qfgcct823xgeos9vssvk4m.streamlit.app',
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
    repo: `${GH}/rabbitai`,
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
    repo: `${GH}/dalle`,
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
    repo: `${GH}/risk-analysis`,
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
    repo: `${GH}/E-Commerce-Sales-Analysis`,
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
    repo: `${GH}/typedrop`,
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
    repo: `${GH}/urlshortner`,
  },
]

export const byDomain = (domain: Domain) => PROJECTS.filter((p) => p.domains.includes(domain))
