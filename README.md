# 🎙️ MeetWise AI — Autonomous Meeting Intelligence & Action Extractor

<div align="center">

<img src="https://img.shields.io/badge/MeetWise%20AI-2.0-1a73e8?style=for-the-badge&logo=google&logoColor=white" alt="MeetWise AI 2.0" />
<img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Gemini_Flash-3.8-8E75C7?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini Flash 3.8" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
<img src="https://img.shields.io/badge/Node.js_%2F_Express-Fullstack-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Express" />

<p align="center">
  <b>Turn messy, multi-hour meeting transcripts into structured action items, executive summaries, decision records, and technical risks in seconds.</b>
</p>

<p align="center">
  <a href="https://meetwise-ai.netlify.app/"><img src="https://img.shields.io/badge/🚀%20Live%20Demo-meetwise--ai.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" /></a>
  &nbsp;
  <a href="https://github.com/bikram73/MeetWise_AI"><img src="https://img.shields.io/badge/💻%20GitHub%20Repo-bikram73%2FMeetWise__AI-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" /></a>
</p>

</div>

---

# 🔗 Quick Links

<div align="center">

| **Resource** | **URL / Link** | **Status** |
|:---|:---|:---:|
| **🌐 Live Web App** | [https://meetwise-ai.netlify.app/](https://meetwise-ai.netlify.app/) | ![Netlify Status](https://img.shields.io/badge/Deployed-Live-success?style=flat-square) |
| **💻 GitHub Repository** | [https://github.com/bikram73/MeetWise_AI](https://github.com/bikram73/MeetWise_AI) | ![GitHub Repo](https://img.shields.io/badge/Repository-Open%20Source-blue?style=flat-square) |

</div>

---

# 📑 Table of Contents

<div align="center">

| **<div align="center">📖 Description</div>** | **<div align="center">🚀 Section</div>** |
|--------------------------------------------------------------|------------------------------------------------|
| <div align="center">**Experience the live production application on Netlify.** 👉</div> | <div align="center"><a href="https://meetwise-ai.netlify.app/"><img src="https://img.shields.io/badge/🌐%20Live%20Demo-00C7B7?style=for-the-badge" /></a></div> |
| <div align="center">**Access the official source code on GitHub.** 👉</div> | <div align="center"><a href="https://github.com/bikram73/MeetWise_AI"><img src="https://img.shields.io/badge/💻%20GitHub%20Repo-181717?style=for-the-badge" /></a></div> |
| <div align="center">**View the project features and capabilities.** 👉</div> | <div align="center"><a href="#features"><img src="https://img.shields.io/badge/✨%20Features-4F46E5?style=for-the-badge" /></a></div> |
| <div align="center">**View the technologies, frameworks, and programming languages used.** 👉</div> | <div align="center"><a href="#tech-stack"><img src="https://img.shields.io/badge/🛠️%20Tech%20Stack-0891B2?style=for-the-badge" /></a></div> |
| <div align="center">**Explore the project's folder and file organization.** 👉</div> | <div align="center"><a href="#file-structure"><img src="https://img.shields.io/badge/📂%20File%20Structure-10B981?style=for-the-badge" /></a></div> |
| <div align="center">**Follow the installation steps and local development setup.** 👉</div> | <div align="center"><a href="#installation"><img src="https://img.shields.io/badge/🚀%20Installation-F97316?style=for-the-badge" /></a></div> |
| <div align="center">**Understand how confidence scores are calculated and interpreted.** 👉</div> | <div align="center"><a href="#confidence"><img src="https://img.shields.io/badge/📊%20Confidence%20Scores-2563EB?style=for-the-badge" /></a></div> |
| <div align="center">**View the available REST API endpoints and usage examples.** 👉</div> | <div align="center"><a href="#api"><img src="https://img.shields.io/badge/🌐%20API%20Documentation-0EA5E9?style=for-the-badge" /></a></div> |
| <div align="center">**Explore the complete system architecture, AI workflow, processing pipeline, data flow, deployment design, and technical decisions.** 👉</div> | <div align="center"><a href="./ARCHITECTURE.md"><img src="https://img.shields.io/badge/🏗️%20Architecture%20Document-DC2626?style=for-the-badge" /></a></div> |
| <div align="center">**Review implementation details, AI pipeline, performance metrics, benchmarking, validation strategy, privacy, testing, and technical specifications.** 👉</div> | <div align="center"><a href="./TECHNICAL_REPORT.md"><img src="https://img.shields.io/badge/📊%20Technical%20Report-2563EB?style=for-the-badge" /></a></div> |
| <div align="center">**Review processing speed, latency, and performance benchmarks.** 👉</div> | <div align="center"><a href="#performance"><img src="https://img.shields.io/badge/⚡%20Performance-F59E0B?style=for-the-badge" /></a></div> |
| <div align="center">**Understand the current limitations and known failure cases of the AI extractor.** 👉</div> | <div align="center"><a href="#limitations"><img src="https://img.shields.io/badge/⚠️%20Known%20Limitations-EF4444?style=for-the-badge" /></a></div> |

</div>

---

<a name="features"></a>
## ✨ Project Features & Capabilities

### 🎯 1. Structured Action Items Extraction
- **Task, Owner & Deadline Parsing**: Automatically extracts spoken commitments, maps them to the right person, and resolves natural language dates (e.g., *"Friday EOD"*, *"before July 30"*, *"next Tuesday"*).
- **Priority Detection**: Automatically tags priority (`High`, `Medium`, `Low`) based on urgency, delivery risk, and deadline context.
- **Interactive Task Management**: Real-time status cycling (`Pending` ➡️ `In Progress` ➡️ `Completed`), full search filter across tasks/owners/dates, and priority drop-down filters.
- **Manual Task Injection**: Add custom action items directly into the structured table during post-meeting review.

### 📋 2. Executive Overview & Meeting Objectives
- **Synthesized Overview**: Condenses hours of dialogue into an articulate executive summary highlighting context, outcomes, and business impact.
- **Core Meeting Objective**: Distills the single driving purpose of the meeting.
- **Key Discussion Takeaways**: Itemized list of core discussion points with speaker attribution.

### ⚖️ 3. Formal Decisions Tracker
- Isolates agreed decisions from open debates and brainstorming chatter.
- Tracks initiative statuses: `Approved`, `Delayed`, `Deferred`, or `Rejected`.
- Displays organizational impact tags and detailed rationale.

### ⚠️ 4. Risk & Open Questions Analyzer
- Identifies technical bottlenecks, infrastructure roadblocks, and cross-team dependencies.
- Surfaces unanswered questions requiring follow-up during future standups.

### 📁 5. Universal File Ingestion
- Upload and analyze files in **`.txt`**, **`.vtt`** (web video text tracks), **`.srt`** (subtitles), **`.md`**, **`.pdf`**, and **`.docx`**.
- Intelligent client-side parser removes timestamps and normalizes speaker turns before AI ingestion.

### ⚡ 6. Multi-Format Instant Export
- **Markdown (.md)**: Production-grade formatted meeting minutes ready for Notion, GitHub, Obsidian, or Confluence.
- **JSON (.json)**: Strongly typed JSON schema for Jira, Linear, Asana, Zapier, or database persistence.
- **PDF Report**: High-resolution print-optimized executive report.
- **Clipboard Sync**: One-click instant copy for Slack, Microsoft Teams, or Google Docs.

### 💡 7. 5 Real-World Curated Sample Transcripts
1. **Project Sync**: Engineering team aligning on dashboard redesign, API integrations, and performance testing.
2. **Q3 Strategy & Roadmap Planning**: Executive discussion resolving Legacy Auth SSO/SAML vs. AI Workspace priorities.
3. **Sprint Retrospective**: Frontend & platform review of CI/CD flakiness, branch conflicts, and QA bottlenecks.
4. **Product Launch & Go-To-Market Alignment**: VP Marketing, Sales Enablement, and Design finalizing press releases and webinar invites.
5. **Production Incident Post-Mortem**: SRE and backend engineers analyzing database connection pool exhaustion and failover mitigation.

---

<a name="tech-stack"></a>
## 🛠️ Tech Stack & Languages

```
┌────────────────────────────────────────────────────────────────────────┐
│                          MEETWISE AI FULLSTACK                         │
├────────────────────────────────┬───────────────────────────────────────┤
│  Frontend Layer                │  Backend & AI Intelligence            │
│  ├─ React 19 (SPA)             │  ├─ Node.js (v20+)                    │
│  ├─ TypeScript (~5.8)          │  ├─ Express.js (v4.21)                │
│  ├─ Vite 6 & @tailwindcss/vite │  ├─ Google Gen AI SDK (@google/genai) │
│  ├─ Tailwind CSS v4            │  ├─ Gemini 3.8 Flash (Primary Model)  │
│  ├─ Motion & Lucide Icons      │  ├─ Multi-Model Fallback Waterfall    │
│  └─ Material Symbols Outlined  │  └─ Smart Heuristic Regex Engine      │
└────────────────────────────────┴───────────────────────────────────────┘
```

### 💻 Programming Languages
- **TypeScript**: 100% end-to-end typed codebase (frontend components, types, utils, and Express backend).
- **CSS / Tailwind CSS v4**: Theme tokens, responsive viewport layouts, zero-clutter high contrast typography.
- **HTML5**: Semantic document layout with accessible screen reader labels and custom Google fonts (`Inter`).

### 📦 Key Libraries & Frameworks
| Category | Technology | Version | Purpose |
|:---|:---|:---|:---|
| **Frontend Framework** | `React` | `^19.0.1` | Reactive UI, hooks, and modular component hierarchy |
| **Build Tool** | `Vite` | `^6.2.3` | Ultra-fast HMR and optimized asset bundling |
| **Type System** | `TypeScript` | `~5.8.2` | Static typing, interface consistency, and zero compiler errors (`tsc --noEmit`) |
| **Styling** | `Tailwind CSS` | `^4.1.14` | Modern utility-first styling with `@tailwindcss/vite` |
| **AI Foundation** | `@google/genai` | `^2.4.0` | Official Google GenAI SDK for Gemini 3.8 Flash structured output |
| **Server Framework** | `Express` | `^4.21.2` | Robust API middleware, rate limiting, and request sanitization |
| **Development Server** | `tsx` | `^4.21.0` | TypeScript Node runtime with zero transpile lag |
| **Icons & Visuals** | `lucide-react` & `Google Material Symbols` | Latest | High-fidelity vector iconography and UI markers |

---

<a name="file-structure"></a>
## 📂 File Structure

```
meetwise-ai/
├── 📄 .env.example                  # Environment template (GEMINI_API_KEY)
├── 📄 .gitignore                    # Standard Git ignore list
├── 📄 bun.lock                      # Dependency lockfile
├── 📄 index.html                    # Application entry HTML with Inter fonts
├── 📄 metadata.json                 # AI Studio applet metadata & permissions
├── 📄 netlify.toml                  # Netlify deployment configuration
├── 📄 package.json                  # NPM scripts, dependencies & engines
├── 📄 server.ts                     # Fullstack Express API server & Gemini runner
├── 📄 tsconfig.json                 # TypeScript compiler configuration
├── 📄 vite.config.ts                # Vite build configuration with Tailwind plugin
├── 📄 ARCHITECTURE.md               # End-to-end Architecture & System Design
├── 📄 TECHNICAL_REPORT.md           # Engineering Metrics, Benchmarks & Validation
├── 📄 README.md                     # Project documentation & setup guide
├── 📁 public/                       # Static public assets (Favicon, logos)
└── 📁 src/
    ├── 📄 App.tsx                   # Top-level view router (Landing <-> Workspace)
    ├── 📄 index.css                 # Global Tailwind CSS v4 import & custom theme
    ├── 📄 main.tsx                  # React DOM client entry point
    ├── 📄 types.ts                  # Shared TypeScript interfaces & types
    ├── 📁 components/
    │   ├── 📄 ActionItemsTable.tsx  # Editable task table with status/search/filter
    │   ├── 📄 DecisionsCard.tsx     # Decision records with impact tags
    │   ├── 📄 ExportModal.tsx       # Export modal (Markdown, JSON, PDF, Clipboard)
    │   ├── 📄 JsonViewer.tsx        # Syntax-highlighted JSON viewer with download
    │   ├── 📄 LandingPage.tsx       # Marketing landing page with hero, features & FAQ
    │   ├── 📄 MarkdownViewer.tsx    # Live rendered Markdown preview and raw copy
    │   ├── 📄 ProcessingAnimationModal.tsx # Progress steps animation during AI inference
    │   ├── 📄 SummaryTab.tsx        # Executive summary, objective & risks grid
    │   └── 📄 WorkspacePage.tsx     # Main AI analysis workbench & split editor
    ├── 📁 data/
    │   └── 📄 sampleTranscripts.ts  # 5 realistic meeting transcript datasets
    └── 📁 utils/
        └── 📄 fileParsers.ts        # Client-side .vtt, .srt, .txt, .docx parser & export
```

---

<a name="installation"></a>
## 🚀 Installation & Local Development Setup

Follow these steps to run MeetWise AI locally on your system:

### 1️⃣ Prerequisites
- **Node.js**: `v20.x` or higher installed ([Download Node.js](https://nodejs.org/))
- **Package Manager**: `npm` (v10+), `yarn`, `pnpm`, or `bun`
- **Gemini API Key**: Free tier or paid API key from [Google AI Studio](https://aistudio.google.com/)

### 2️⃣ Clone Repository & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/bikram73/MeetWise_AI.git

# Enter project directory
cd MeetWise_AI

# Install dependencies
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Open `.env` and add your Google Gemini API key:
```env
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
PORT=3000
```

### 4️⃣ Start the Local Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000` with the Vite frontend mounted onto Express.

### 5️⃣ Production Build
```bash
# Build Vite client and bundle server via esbuild
npm run build

# Start production server
npm start
```

---

<a name="confidence"></a>
## 📊 Confidence Scores & Validation Strategy

MeetWise AI implements an automated **Confidence Scoring System** that evaluates extraction quality across 4 key dimensions:

> **Important Evaluation Note:** The confidence score represents an **extraction signal** (evaluating how explicitly the transcript presents owners, calendar deadlines, and agreed actions). It serves as a quality indicator for human review and should not be treated as a proof that the underlying meeting participants' spoken claims are factually accurate.

```
┌────────────────────────────────────────────────────────┐
│              EXTRACTION CONFIDENCE MATRIX              │
├───────────────────────┬────────┬───────────────────────┤
│ Dimension             │ Weight │ Metric Evaluated      │
├───────────────────────┼────────┼───────────────────────┤
│ 👤 Owner Attribution  │  35%   │ Named entity in turn  │
│ 📅 Deadline Precision │  30%   │ Explicit date/time    │
│ 🎯 Semantic Clarity   │  20%   │ Verb-object clarity   │
│ ⚡ Decision Agreement │  15%   │ Consensus indicator   │
└───────────────────────┴────────┴───────────────────────┘
```

- **High Confidence (90% - 100%)**: Spoken turn contains clear owner pronoun or direct address with calendar date (e.g., *"Marcus will draft the spec by Friday, October 11th"*).
- **Medium Confidence (75% - 89%)**: Relative temporal markers (e.g., *"I'll finish this next week"* or *"after testing"*).
- **Low Confidence (< 75%)**: Passive voice or unassigned intent (e.g., *"We should improve application performance"* ➡️ assigned to `Unassigned` with priority `Low`).

---

<a name="api"></a>
## 🌐 API Documentation

### `POST /api/analyze`
Accepts a raw meeting transcript and returns structured AI-extracted analysis.

#### Request Body
```json
{
  "transcript": "Alice: We need to complete the redesign before July 30.\nBob: I'll finish the API integration by next Tuesday.",
  "customPrompt": "Focus on high-priority deadlines and technical dependencies."
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "meeting_title": "Product Redesign & API Integration Sync",
    "meeting_objective": "Coordinate dashboard redesign timeline and API milestones.",
    "summary": "Alice and Bob aligned on delivery targets for the redesign initiative...",
    "discussion_points": [
      "Dashboard redesign target date before July 30",
      "API integration completion scheduled for next Tuesday"
    ],
    "decisions": [
      "Team committed to completing API integration prior to final redesign sign-off."
    ],
    "risks": [
      "Short turnaround between API completion and final redesign deployment."
    ],
    "open_questions": [],
    "action_items": [
      {
        "task": "Complete the dashboard redesign",
        "owner": "Alice",
        "due_date": "July 30",
        "priority": "High",
        "status": "Pending"
      },
      {
        "task": "Finish the API integration",
        "owner": "Bob",
        "due_date": "Next Tuesday",
        "priority": "High",
        "status": "Pending"
      }
    ]
  }
}
```

---

<a name="performance"></a>
## ⚡ Performance & Benchmarks

Benchmarked across 5 sequential test runs on Linux/Node.js v22.23.2 against `/api/analyze` using the standard multi-speaker dataset (including network roundtrip to Google GenAI endpoints):

| Metric | Target | Realized Measurement | Status |
|:---|:---|:---|:---|
| **Cold Start Inference** | `< 3.5s` | `2.45s` (Gemini 3.8 Flash end-to-end) | ✅ **Passing** |
| **Warm Start Inference** | `< 2.5s` | `1.78s - 1.95s` (Gemini 3.1 Flash Lite) | ✅ **Optimal** |
| **Client Bundle Size (All Chunks)** | `< 500 KB gzip` | `375 KB gzip` (App + PDF & Docx parsers) | ✅ **Production Optimized** |
| **Client Interaction Latency** | `< 16ms` | `< 4ms` (Instant 60fps status change via React 19) | ✅ **Passing** |
| **Fallback Engine Latency** | `< 50ms` | `11ms` (Pure local regex execution) | ✅ **Instantaneous** |

---

<a name="limitations"></a>
## ⚠️ Known Limitations

1. **Audio File Processing**: The current engine ingests text transcriptions (`.txt`, `.vtt`, `.srt`, `.docx`). Direct `.mp3` or `.wav` ingestion requires pre-transcription via Whisper or Google Speech-to-Text.
2. **Ambiguous Pronoun Anaphora**: In chaotic conversational overlap where pronouns (*"he"*, *"they"*) are used without previous subject reference, the extractor may assign the task to `Unassigned`.
3. **Slang / Informal Deadlines**: Colloquial expressions like *"in a bit"* or *"down the road"* are captured as `"Not Specified"` rather than approximated dates.

---

## 🔒 Privacy & Security
- **No Long-Term Data Logging**: Transcripts submitted to `/api/analyze` are processed in ephemeral memory and never written to cold storage.
- **Zero Third-Party Telemetry**: No tracking scripts, analytics cookies, or behavioral pixels are loaded.
- **Enterprise Safe**: Gemini API requests use the Google Cloud developer guidelines with strict non-retention policies.

---

## 📜 License
Distributed under the **MIT License**. Free for commercial and private use.
