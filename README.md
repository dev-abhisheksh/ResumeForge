# 🚀 ResumeForge — Enterprise AI ATS Resume Optimization & Tailoring Platform

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-Implemented-orange)
![LaTeX](https://img.shields.io/badge/LaTeX-008080?logo=latex&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)

ResumeForge is an enterprise-grade AI ATS Optimization & Resume Tailoring Platform built to give job seekers a competitive edge. Powered by Node.js, Express, TypeScript, Next.js 15, and Groq AI (Llama 3.3-70B), ResumeForge parses raw master resumes, calculates instant ATS match scores in ~1.5s against target Job Descriptions, diagnoses critical keyword gaps, suggests company-tailored project ideas, and exports clean, single-page ATS-optimized LaTeX source code.

---

**🔗 Live Demo:** https://resume-forge-6myb.vercel.app/

---

## 🚀 Key Features

- **Fast-Path ATS Diagnostic Engine (~1.5s)** – Optimized scoring pipeline that calculates ATS match percentages, category breakdowns (Keywords, Skills, Experience, Education), and matched/missing keyword gaps in under 2 seconds by decoupling score calculation from secondary LLM recommendation streams.
- **Groq AI & Llama 3.3-70B Integration** – High-speed structured parsing and recommendation generation utilizing Groq's LPUs for ultra-fast response times.
- **Zero-Hallucination Project Vault** – Dedicated vault storing authentic candidate projects (Title, Subtitle, Tech Stack, Metrics) to dynamically swap into tailored resumes without inventing fake experience.
- **Single-Page ATS LaTeX Generator** – Injects candidate skills, experience, education, and swapped vault projects into a battle-tested, single-page LaTeX template (`.tex`) ready for instant Overleaf compilation or PDF export.
- **Company & JD-Tailored Project Ideas Engine** – Generates 2–3 cutting-edge, role-specific project ideas complete with target tech stacks and key features to help candidates demonstrate missing keywords for target companies (e.g., Google, Netflix, FinTech startups).
- **ATS Score 90%+ Improvement Roadmap** – Actionable step-by-step checklist providing estimated score boosts (e.g., `+8% by adding Redis Redlock to project bullets`).
- **Custom Redis Rate Limiting** – Native `ioredis` middleware enforcing route-level rate limits (`INCR` + `EXPIRE` on `count === 1`) with fail-open fault tolerance to protect AI endpoints from abuse.
- **Async Queue Architecture** – Scalable handling of heavy background operations using BullMQ queues and Upstash Redis.
- **Neubrutalism Design System** – Bold, high-contrast UI featuring vibrant accent borders, crisp typography, and responsive micro-interactions.
- **JWT & Cookie Session Management** – Secure access token and refresh token rotation paired with Next.js middleware route protection.

---

## 🧠 Tech Stack

### **Frontend**
- **Framework:** Next.js 15 (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Vanilla CSS & TailwindCSS (Neubrutalism Design Token System)
- **State & Data Fetching:** TanStack Query (React Query)
- **UI Icons & Toasts:** Lucide React, Sonner

### **Backend**
- **Runtime & Framework:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ORM)
- **Caching & Rate Limiting:** Upstash Redis (`ioredis`)
- **Queue & Async Processing:** BullMQ
- **AI Models:** Groq SDK (`llama-3.3-70b-versatile`), Google Gemini SDK
- **Templating Engine:** Custom Single-Page ATS LaTeX Compiler Engine

---

## 📁 Repository Structure

```
/ResumeForge
├── /backend
│   ├── /src
│   │   ├── /config         # Groq, Redis, DB connection setups
│   │   ├── /controllers    # Express request handlers
│   │   ├── /middlewares    # Auth, Rate-limiter (ioredis INCR+EXPIRE), Error handlers
│   │   ├── /modules        # Feature modules (auth, resume, project, resume-analysis)
│   │   │   ├── /auth
│   │   │   ├── /project
│   │   │   ├── /resume
│   │   │   └── /resume-analysis
│   │   ├── /prompts        # AI prompt templates (ats-recommendation, tailor-resume, project-summary)
│   │   ├── /queues         # BullMQ queue definitions
│   │   ├── /services       # ATS calculation, LaTeX compiler, Groq AI services
│   │   ├── /templates      # Master ATS LaTeX template (.tex) definitions
│   │   ├── /types          # TypeScript interfaces & API schemas
│   │   ├── /utils          # ApiError, asyncHandler, escapeLatex helpers
│   │   └── /workers        # BullMQ background worker threads
│   ├── tsconfig.json
│   └── package.json
│
├── /frontend
│   ├── /src
│   │   ├── /api            # Axios API service client layer
│   │   ├── /app            # Next.js 15 App Router pages ((auth), (dashboard), analysis, tailor, project, resumes)
│   │   ├── /components     # Dashboard, Navbar, Sidebar, AnalysisWorkspace, ProjectVault UI components
│   │   ├── /hooks          # React Query mutation & query hooks
│   │   ├── /lib            # Axios instance, Toast notifications
│   │   └── /types          # Frontend TypeScript interfaces
│   ├── tsconfig.json
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

### **Backend (`/backend/.env`)**
| Variable               | Description                                    |
|------------------------|------------------------------------------------|
| `PORT`                 | Express server port (default: 5000)            |
| `MONGODB_URL`          | MongoDB Atlas URI                              |
| `REDIS_URL`            | Upstash Redis URI (`rediss://...`)             |
| `ACCESS_TOKEN_SECRET`  | Secret key for Access JWT                      |
| `REFRESH_TOKEN_SECRET` | Secret key for Refresh JWT                     |
| `GROQ_API_KEY`         | Groq Cloud API Key (`llama-3.3-70b-versatile`) |
| `GEMINI_API_KEY`       | Google Gemini API Key                          |

### **Frontend (`/frontend/.env.local`)**
| Variable               | Description                                    |
|------------------------|------------------------------------------------|
| `NEXT_PUBLIC_API_URL`  | Backend REST API Base URL                      |

---

## 🧩 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account / local database
- Upstash Redis instance
- Groq Cloud API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/dev-abhisheksh/ResumeForge.git
cd ResumeForge

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Development

```bash
# Run backend dev server (from backend directory)
npm run dev

# Run background workers (if processing async queues)
npm run worker

# Run frontend dev server (from frontend directory)
npm run dev
```

---

## 📡 API Endpoint Overview

### Auth Module (`/api/v1/auth`)
| Endpoint         | Method | Description                         |
|------------------|--------|-------------------------------------|
| `/register`      | POST   | Register user & set auth cookies    |
| `/login`         | POST   | Login user & return tokens          |
| `/refresh-token` | POST   | Rotate access token via refresh key |

### Master Resumes (`/api/v1/resume`)
| Endpoint         | Method | Description                         |
|------------------|--------|-------------------------------------|
| `/upload`        | POST   | Upload master raw resume text/file  |
| `/my-resumes`    | GET    | Fetch user's uploaded master resumes|
| `/:id`           | DELETE | Delete a master resume entry        |

### Resume Analysis (`/api/v1/resume-analysis`)
| Endpoint              | Method | Description                                            |
|-----------------------|--------|--------------------------------------------------------|
| `/analyze/:resumeId`  | POST   | Run fast-path ATS score, keyword gap scan, & AI guide  |
| `/tailor/:resumeId`   | POST   | Swap vault projects & export single-page LaTeX code   |
| `/recent`             | GET    | Fetch recent 5 AI analysis reports                     |
| `/dashboard-stats`    | GET    | Aggregated user stats & missing skill gaps analytics   |

### Project Vault (`/api/v1/project`)
| Endpoint         | Method | Description                         |
|------------------|--------|-------------------------------------|
| `/add`           | POST   | Save new project entry to vault     |
| `/my-projects`   | GET    | Fetch candidate's vault projects    |
| `/:id`           | DELETE | Remove project from vault           |

---

## 🧠 Architecture Highlights

### **1. Fast-Path Scoring Pipeline**
By default, calling `POST /analyze/:resumeId` with `includeRecommendations: false` bypasses secondary AI recommendation LLM chains, returning **ATS Scores, Category Breakdown, and Matched/Missing Keywords in ~1.5 seconds**.

### **2. Fail-Open Custom Redis Rate Limiting**
Route-level rate limits (e.g. 10 req / hr for AI analysis, 5 req / 15 min for registration) utilize native `ioredis` commands (`INCR` + `EXPIRE` on `count === 1`). Wrapped in try-catch blocks, the middleware fails open if Redis experiences network hiccups, guaranteeing uninterrupted uptime.

---

## ⚙️ Deployment

| Component       | Service Provider |
|-----------------|------------------|
| Frontend        | Vercel           |
| Backend API     | Render / Railway |
| Database        | MongoDB Atlas    |
| Caching & Queues| Upstash Redis    |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/new-feature`)
3. Commit changes (`git commit -m "Add new feature"`)
4. Push to branch (`git push origin feat/new-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abhishek Sharma**  
[GitHub](https://github.com/dev-abhisheksh) • [Live App](https://resume-forge-6myb.vercel.app/)

---

⭐ **Star this repo** if you find it helpful!
