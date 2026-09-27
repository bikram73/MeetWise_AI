import React, { useState } from 'react';

interface LandingPageProps {
  onOpenWorkspace: () => void;
  onOpenHistory?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenWorkspace, onOpenHistory }) => {
  const [demoProcessing, setDemoProcessing] = useState(false);
  const [demoProcessed, setDemoProcessed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDemoProcess = () => {
    setDemoProcessing(true);
    setTimeout(() => {
      setDemoProcessing(false);
      setDemoProcessed(true);
    }, 1500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does MeetWise AI protect my meeting data?',
      a: 'All data is processed strictly via enterprise TLS encryption. Analyzed transcripts and intelligence data are saved locally inside your browser’s localStorage. We never retain, store on third-party servers, or use your proprietary dialogue to train public AI models.',
    },
    {
      q: 'Which file formats and video platforms are supported?',
      a: 'MeetWise AI natively accepts .txt, .vtt (Zoom & Google Meet captions), .srt (Subtitles), .md (Markdown), .docx (Word), and .pdf documents, as well as direct text paste.',
    },
    {
      q: 'What export options are available?',
      a: 'You can export complete meeting reports in Markdown (.md) for Notion or GitHub, strongly-typed JSON for Jira/Linear/Zapier, print-ready PDF reports, or one-click copy to clipboard.',
    },
    {
      q: 'What transcript length can MeetWise AI handle?',
      a: 'MeetWise AI processes full meetings up to 100,000 characters (approximately 15,000–20,000 words or 60–90 minute discussions) in a single pass.',
    },
    {
      q: 'Is there a cost or subscription required?',
      a: 'MeetWise AI is free to use with all features enabled, including sample presets, file uploads, decision detection, action item assignment, and history persistence.',
    },
    {
      q: 'How accurate is speaker and owner recognition?',
      a: 'Our deterministic intelligence engine cross-verifies speaker dialogue, assignment pronouns, and context to reliably attribute action items, deadlines, and priorities.',
    },
    {
      q: 'Which AI model powers MeetWise AI?',
      a: 'MeetWise AI runs on Google Gemini models (Gemini 3 Flash & Pro series) with automated multi-tier failover and offline heuristic extraction safeguards.',
    },
    {
      q: 'Does it save my previous meetings?',
      a: 'Yes! All analyzed meetings and their action items, summaries, and confidence scores are automatically stored in your browser LocalStorage for instant search and one-click reload.',
    },
    {
      q: 'What happens if I work offline or lose connectivity?',
      a: 'MeetWise AI includes an offline zero-hallucination heuristic engine that safely extracts speaker turns, tasks, decisions, and deadlines directly in-memory without breaking.',
    },
    {
      q: 'Can I customize the extraction focus?',
      a: 'Yes, you can provide custom prompt directives in the workspace to prioritize technical risks, security blockers, executive milestones, or specific stakeholder deliverables.',
    },
  ];

  return (
    <div className="bg-white text-[#131b2e] font-sans overflow-x-hidden">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#c1c6d6]/20 shadow-xs h-16 flex items-center">
        <div className="flex justify-between items-center px-4 md:px-10 w-full max-w-[1280px] mx-auto">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white shadow-md shadow-[#1a73e8]/25 shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="m9 10 2 2 4-4" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base md:text-xl font-bold text-[#1a73e8] leading-tight">MeetWise AI</span>
              <span className="text-[9px] md:text-[11px] font-semibold text-[#005bbf] tracking-wide leading-none">AI Workspace</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#414754] hover:text-[#005bbf] transition-colors font-medium cursor-pointer"
            >
              Home
            </button>
            <a className="text-[#414754] hover:text-[#005bbf] transition-colors font-medium" href="#features">Features</a>
            <a className="text-[#414754] hover:text-[#005bbf] transition-colors font-medium" href="#workflow">Workflow</a>
            <a className="text-[#414754] hover:text-[#005bbf] transition-colors font-medium" href="#demo">Demo</a>
            <a className="text-[#414754] hover:text-[#005bbf] transition-colors font-medium" href="#faq">Docs</a>
            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="text-[#414754] hover:text-[#005bbf] transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#1a73e8]">history</span>
                <span>History</span>
              </button>
            )}
          </div>

          {/* Action CTAs & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="hidden sm:flex md:hidden lg:hidden items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                title="View Transcript History"
              >
                <span className="material-symbols-outlined text-[16px] text-[#1a73e8]">history</span>
                <span>History</span>
              </button>
            )}
            <button
              onClick={onOpenWorkspace}
              className="bg-[#1a73e8] hover:bg-[#005bbf] text-white px-3 sm:px-5 py-2 rounded-xl font-semibold text-xs md:text-sm scale-95 active:scale-90 transition-all shadow-md shadow-[#1a73e8]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="hidden xs:inline">Open Workspace</span>
              <span className="xs:hidden">Workspace</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl px-6 py-5 flex flex-col gap-4 animate-fadeIn">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="text-left font-semibold text-sm text-slate-700 hover:text-[#005bbf] py-1"
            >
              Home
            </button>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left font-semibold text-sm text-slate-700 hover:text-[#005bbf] py-1"
            >
              Features
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left font-semibold text-sm text-slate-700 hover:text-[#005bbf] py-1"
            >
              Workflow
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left font-semibold text-sm text-slate-700 hover:text-[#005bbf] py-1"
            >
              Demo
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left font-semibold text-sm text-slate-700 hover:text-[#005bbf] py-1"
            >
              Docs & FAQ
            </a>
            {onOpenHistory && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenHistory();
                }}
                className="text-left font-semibold text-sm text-[#1a73e8] py-1 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>Transcript History</span>
              </button>
            )}
            <a
              href="https://github.com/bikram73/MeetWise_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left font-semibold text-sm text-slate-700 hover:text-[#005bbf] py-1 flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub Repository</span>
            </a>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWorkspace();
                }}
                className="w-full bg-[#1a73e8] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch AI Workspace</span>
                <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#4d8efe]/10 text-[#005bbf] border border-[#4d8efe]/20 px-4 py-1.5 rounded-full mb-8">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span className="text-xs font-semibold">Now Live • Next-Gen AI Engine</span>
          </div>
          <h1 className="text-4xl md:text-[64px] font-bold max-w-4xl mx-auto leading-tight mb-6 tracking-tight">
            Turn Meeting Notes Into <span className="ai-gradient-text">Actionable Results</span> with AI
          </h1>
          <p className="text-lg md:text-xl text-[#414754] max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop manually summarizing calls. Paste your Zoom, Teams, or Google Meet transcripts and let MeetWise extract owner recognition, due dates, and priority tasks in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenWorkspace}
              className="ai-gradient text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-[#005bbf]/20 hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
            >
              Analyze Transcript <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <a
              href="#demo"
              className="bg-white border border-[#c1c6d6] px-8 py-4 rounded-xl font-semibold text-[#414754] hover:bg-[#f2f3ff] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Try Demo</span>
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-24 bg-[#f2f3ff]/50" id="demo">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
            <p className="text-[#414754] max-w-xl mx-auto">
              Experience how our intelligence layer transforms messy spoken text into structured project data.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 glass-panel p-4 md:p-6 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
            {/* Input Side */}
            <div className="flex flex-col bg-white rounded-2xl border border-[#c1c6d6]/30 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#c1c6d6]/30 flex justify-between items-center bg-[#ffffff]">
                <span className="font-semibold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005bbf]">description</span>
                  Raw Transcript
                </span>
                <span className="text-xs text-[#727785]">2,450 words detected</span>
              </div>
              <div className="p-6 flex-grow overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-[#414754]">
                <p className="mb-4">
                  <span className="text-[#005bbf] font-bold">[Alex]</span>: Hey everyone, thanks for joining. We need to finalize the Q3 marketing budget by Friday. Sarah, can you handle the outreach to the ad agency?
                </p>
                <p className="mb-4">
                  <span className="text-[#005ac1] font-bold">[Sarah]</span>: Sure thing Alex. I'll get that proposal over by Thursday morning.
                </p>
                <p className="mb-4">
                  <span className="text-[#732de4] font-bold">[Mike]</span>: I'm worried about the timeline for the new landing page. We need the assets from the design team first.
                </p>
                <p className="mb-4">
                  <span className="text-[#005bbf] font-bold">[Alex]</span>: Understood. Mike, coordinate with Jessica to get those assets by Wednesday. Mark that as a high priority.
                </p>
                <div className="animate-pulse bg-[#e2e7ff] h-4 w-3/4 rounded mb-2"></div>
                <div className="animate-pulse bg-[#e2e7ff] h-4 w-1/2 rounded mb-2"></div>
                <div className="animate-pulse bg-[#e2e7ff] h-4 w-2/3 rounded"></div>
              </div>
              <div className="p-4 bg-white border-t border-[#c1c6d6]/30">
                <button
                  onClick={handleDemoProcess}
                  disabled={demoProcessing}
                  className="w-full ai-gradient text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
                >
                  {demoProcessing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span> Processing...
                    </>
                  ) : demoProcessed ? (
                    <>
                      <span className="material-symbols-outlined">check_circle</span> Processed Successfully
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">bolt</span> Process with AI
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Result Side */}
            <div className="flex flex-col bg-[#F8F9FF] rounded-2xl border border-[#005bbf]/20 relative">
              <div className="absolute top-0 left-0 w-1 h-full ai-gradient"></div>
              <div className="px-6 py-4 border-b border-[#c1c6d6]/30 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <span className="font-bold text-sm flex items-center gap-2 text-[#005bbf]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                  AI Insights
                </span>
                <div className="flex gap-2">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold border border-emerald-600/20">
                    READY
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-[#727785] tracking-wider">Summary</h4>
                  <p className="text-base text-[#131b2e]">
                    The team discussed Q3 marketing budget deadlines and landing page asset dependencies.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-[#727785] tracking-wider">Action Items</h4>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-[#c1c6d6]/20 shadow-sm flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005bbf] text-sm mt-0.5">check_circle</span>
                      <div>
                        <p className="text-sm font-semibold">Finalize Q3 Marketing Budget</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] bg-[#4d8efe]/10 text-[#005bbf] px-1.5 rounded font-medium">
                            Sarah
                          </span>
                          <span className="text-[10px] bg-[#ffdad6]/50 text-[#ba1a1a] px-1.5 rounded font-medium">
                            Due: Friday
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#c1c6d6]/20 shadow-sm flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#005bbf] text-sm mt-0.5">check_circle</span>
                      <div>
                        <p className="text-sm font-semibold">Coordinate Design Assets</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] bg-[#4d8efe]/10 text-[#005bbf] px-1.5 rounded font-medium">
                            Mike
                          </span>
                          <span className="text-[10px] bg-[#8d4efe]/10 text-[#732de4] px-1.5 rounded font-medium">
                            High Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 max-w-[1280px] mx-auto px-4 md:px-10" id="features">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Precision-Engineered for Results</h2>
          <p className="text-[#414754] max-w-xl mx-auto">
            Engineered to extract value from every conversation using the world's most advanced LLMs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl border border-[#c1c6d6]/30 ai-card-glow transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#005bbf]/5 flex items-center justify-center text-[#005bbf] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            </div>
            <h3 className="text-xl font-bold mb-3">AI Summary</h3>
            <p className="text-[#414754] text-sm leading-relaxed">
              Instant executive summaries that capture the essence of 60-minute calls in seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl border border-[#c1c6d6]/30 ai-card-glow transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#732de4]/5 flex items-center justify-center text-[#732de4] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Decision Detection</h3>
            <p className="text-[#414754] text-sm leading-relaxed">
              Automatically flags whenever a team makes a definitive choice or pivot.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-3xl border border-[#c1c6d6]/30 ai-card-glow transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#005ac1]/5 flex items-center justify-center text-[#005ac1] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Action Items</h3>
            <p className="text-[#414754] text-sm leading-relaxed">
              Extract clear, bulleted tasks directly from spoken promises.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-3xl border border-[#c1c6d6]/30 ai-card-glow transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#ba1a1a]/5 flex items-center justify-center text-[#ba1a1a] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Owner Recognition</h3>
            <p className="text-[#414754] text-sm leading-relaxed">
              Uses context clues to assign every action item to the correct stakeholder.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-3xl border border-[#c1c6d6]/30 ai-card-glow transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#005bbf]/5 flex items-center justify-center text-[#005bbf] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Due Date Extraction</h3>
            <p className="text-[#414754] text-sm leading-relaxed">
              Smart NLP identifies dates like "next Tuesday" and converts them to ISO dates.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-3xl border border-[#c1c6d6]/30 ai-card-glow transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#005ac1]/5 flex items-center justify-center text-[#005ac1] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Priority Scoring</h3>
            <p className="text-[#414754] text-sm leading-relaxed">
              Determines urgency levels based on meeting tone and specific key phrases.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="bg-white p-8 rounded-3xl border border-[#c1c6d6]/30 ai-card-glow transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#732de4]/5 flex items-center justify-center text-[#732de4] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>data_object</span>
            </div>
            <h3 className="text-xl font-bold mb-3">JSON Export</h3>
            <p className="text-[#414754] text-sm leading-relaxed">
              Developer-friendly raw data export for seamless integration into Jira or Trello.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="bg-white p-8 rounded-3xl border border-[#c1c6d6]/30 ai-card-glow transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#005bbf]/5 flex items-center justify-center text-[#005bbf] mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>markdown</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Markdown Support</h3>
            <p className="text-[#414754] text-sm leading-relaxed">
              Clean, formatted documentation ready for Notion or GitHub Wikis.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-[#e2e7ff]/30" id="workflow">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="md:sticky md:top-32 w-full md:w-1/3">
              <h2 className="text-3xl font-bold mb-6 leading-tight">The Frictionless Pipeline</h2>
              <p className="text-[#414754] text-lg mb-8">
                Four simple steps to transform human speech into structured productivity.
              </p>
              <button
                onClick={onOpenWorkspace}
                className="bg-[#005bbf] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-[#1a73e8] transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>
            <div className="w-full md:w-2/3 relative pl-8 border-l-2 border-[#c1c6d6]/30 space-y-24">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-[#005bbf] ring-8 ring-[#faf8ff]"></div>
                <h3 className="text-2xl font-bold mb-4">01. Paste Transcript</h3>
                <p className="text-[#414754] text-base mb-6">
                  Import your text from any video conferencing platform. We support raw VTT, SRT, or simple copy-paste blocks.
                </p>
                <div className="bg-white p-6 rounded-2xl border border-[#c1c6d6]/30 shadow-sm">
                  <img
                    className="rounded-xl w-full"
                    alt="A clean, minimalist user interface showing a large text area with a 'Paste Transcript' placeholder."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU_qttSCM72u0pijGLuMkmXV6hkJfp0rWZueRage1DE6KjLV7KMksH_rUxhDtPRzISDVuHz5PZpy2-rxeFOwEUqPv96wuN_1i-Gqme-KkxQmrXnZzgxPIE_w4pL73oV6wPjNba2Hh9Mkexarjg6m_Rh4jl8i4bZMnKW7y5WT9NFXCzpy_tUmqU7JXs3yCfp1L3m-T4QTKj6iEJsajilqxNg28aOrOf6e2pvPTnmdc7eTkroEriqaZ1IentSOAWPZaRFIuONGt9CG8"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-[#005ac1] ring-8 ring-[#faf8ff]"></div>
                <h3 className="text-2xl font-bold mb-4">02. AI Semantic Read</h3>
                <p className="text-[#414754] text-base mb-6">
                  Our proprietary engine reads the entire context, identifying speakers and nuances that keyword search misses.
                </p>
                <div className="bg-white p-6 rounded-2xl border border-[#c1c6d6]/30 shadow-sm h-48 overflow-hidden relative">
                  <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
                    <span className="material-symbols-outlined text-4xl text-[#005bbf] animate-pulse mb-2">
                      flare
                    </span>
                    <p className="text-xs font-mono text-[#727785]">Analyzing sentiments & context...</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-[#732de4] ring-8 ring-[#faf8ff]"></div>
                <h3 className="text-2xl font-bold mb-4">03. Intelligent Extraction</h3>
                <p className="text-[#414754] text-base mb-6">
                  Decisions, dates, and owners are automatically isolated and tagged with high confidence scores.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-[#c1c6d6]/30 shadow-sm flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#005bbf]"></span>
                    <span className="text-sm font-semibold">Sarah: Q3 Budget</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#c1c6d6]/30 shadow-sm flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#732de4]"></span>
                    <span className="text-sm font-semibold">Friday, Aug 12</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-[#131b2e] ring-8 ring-[#faf8ff]"></div>
                <h3 className="text-2xl font-bold mb-4">04. Return Output</h3>
                <p className="text-[#414754] text-base mb-6">
                  Download your results in your preferred format or push them directly to your project management suite.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-lg border border-[#c1c6d6]/30 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span className="text-xs font-bold">PDF Report</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#c1c6d6]/30 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">api</span>
                    <span className="text-xs font-bold">Notion Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Common Questions</h2>
            <p className="text-[#414754]">Everything you need to know about the platform.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#f2f3ff] rounded-2xl border border-[#c1c6d6]/20 overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-6 text-left cursor-pointer focus:outline-none"
                >
                  <span className="text-lg font-semibold">{faq.q}</span>
                  <span
                    className={`material-symbols-outlined transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-[#414754] text-base border-t border-[#c1c6d6]/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="ai-gradient rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-[56px] font-bold mb-6 leading-tight">
                Ready to make your meetings matter?
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
                Join 5,000+ teams who have reclaimed 10 hours a week using MeetWise AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onOpenWorkspace}
                  className="bg-white text-[#005bbf] px-8 py-4 rounded-xl font-bold hover:bg-[#ffffff]/90 transition-all cursor-pointer shadow-lg"
                >
                  Start Free Now
                </button>
                <button
                  onClick={onOpenWorkspace}
                  className="border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all cursor-pointer"
                >
                  Schedule a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#faf8ff] py-8 border-t border-[#c1c6d6]/30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center text-white shadow-xs shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="m9 10 2 2 4-4" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-[#1a73e8]">MeetWise AI</span>
              <span className="text-xs text-slate-500 ml-2 hidden md:inline">Autonomous Meeting Intelligence</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <a href="#features" className="hover:text-[#005bbf] transition-colors font-medium">Features</a>
            <a href="#workflow" className="hover:text-[#005bbf] transition-colors font-medium">Workflow</a>
            <a href="#demo" className="hover:text-[#005bbf] transition-colors font-medium">Demo</a>
            <a href="#faq" className="hover:text-[#005bbf] transition-colors font-medium">FAQ</a>
            <button
              onClick={onOpenWorkspace}
              className="text-[#005bbf] hover:underline font-semibold cursor-pointer"
            >
              Workspace
            </button>
            <a
              href="https://github.com/bikram73/MeetWise_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-semibold transition-all shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>

          <div className="text-xs text-slate-500">
            © 2026 MeetWise AI
          </div>
        </div>
      </footer>
    </div>
  );
};
