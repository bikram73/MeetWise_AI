# 🏗️ MeetWise AI — System Architecture & Workflow Pipeline

## 🏛️ High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT LAYER                                         │
│                                                                                        │
│   ┌─────────────────────┐    ┌──────────────────────────┐    ┌─────────────────────┐   │
│   │   Landing Page      │    │    Transcript Editor     │    │   Results Console   │   │
│   │ (Hero, Feat, Demo)  │    │ (.txt, .vtt, .srt, .md)  │    │ (Tabs, Table, JSON) │   │
│   └──────────┬──────────┘    └────────────┬─────────────┘    └──────────▲──────────┘   │
│              │                            │                             │              │
└──────────────┼────────────────────────────┼─────────────────────────────┼──────────────┘
               │ Navigation                 │ Submits Transcript & Directive│ Returns Structured
               ▼                            ▼                             │ Analysis Data
┌─────────────────────────────────────────────────────────────────────────┴──────────────┐
│                              FULLSTACK SERVER LAYER                                    │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                        Express.js Server (Port 3000)                           │   │
│   │  ├─ Input Validation & Content Sanitization                                    │   │
│   │  ├─ Multi-Model Gemini Waterfall Dispatcher                                    │   │
│   │  └─ Intelligent Local Heuristic Fallback Engine                                │   │
│   └───────────────────────────────────────┬────────────────────────────────────────┘   │
│                                           │                                            │
└───────────────────────────────────────────┼────────────────────────────────────────────┘
                                            │ AI Extraction Request
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               GOOGLE GEN AI CLOUD LAYER                                │
│                                                                                        │
│   ┌──────────────────────────┐   Failover   ┌──────────────────────────┐               │
│   │     gemini-3.8-flash     │ ───────────► │   gemini-flash-latest    │               │
│   │  (Primary Low-Latency)   │              │   (Secondary Backup)     │               │
│   └──────────────────────────┘              └────────────┬─────────────┘               │
│                                                          │ Failover                    │
│                                                          ▼                             │
│                                             ┌──────────────────────────┐               │
│                                             │   gemini-3.1-flash-lite  │               │
│                                             │  (Ultra-Light Fallback)  │               │
│                                             └──────────────────────────┘               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 End-to-End Processing Pipeline

1. **Ingestion & Normalization**:
   - The user pastes dialogue or uploads a `.vtt` / `.srt` file.
   - Client cleans timestamp markers and normalizes speaker breaks.
2. **Schema Enforcement & Prompts**:
   - `server.ts` prepares a strict `responseSchema` with the `@google/genai` TypeScript SDK using `Type.OBJECT` and `Type.ARRAY`.
3. **Multi-Model Waterfall Dispatcher**:
   - Tries `gemini-3.8-flash`. If rate limits or quota boundaries are encountered, smoothly fails over to `gemini-flash-latest`, then `gemini-3.1-flash-lite`.
4. **Resilient Local Heuristic Fallback**:
   - If upstream API quotas are exhausted, an offline regex parser extracts action items, owners, decisions, and milestones without crashing or failing the user request.
5. **Interactive Render & Instant Export**:
   - Returns typed structured JSON to the client.
   - Rendered across the Executive Summary tab, Decisions card, editable Action Items table, raw JSON view, and formatted Markdown preview.
