import React, { useState } from 'react';
import { MeetingAnalysisResult, ActionItem } from '../types';
import { SAMPLE_TRANSCRIPTS } from '../data/sampleTranscripts';
import { readTranscriptFromFile } from '../utils/fileParsers';
import { SummaryTab } from './SummaryTab';
import { DecisionsCard } from './DecisionsCard';
import { ActionItemsTable } from './ActionItemsTable';
import { JsonViewer } from './JsonViewer';
import { MarkdownViewer } from './MarkdownViewer';
import { ProcessingAnimationModal } from './ProcessingAnimationModal';
import { ExportModal } from './ExportModal';

interface WorkspacePageProps {
  onBackToLanding: () => void;
  onNavigateSection?: (sectionId?: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ onBackToLanding, onNavigateSection }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'decisions' | 'actions' | 'discussion' | 'json' | 'markdown'>('summary');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Default transcript loaded from PRD sample
  const [transcriptText, setTranscriptText] = useState(SAMPLE_TRANSCRIPTS[0].content);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(SAMPLE_TRANSCRIPTS[0].id);

  // Analysis result state initialized with default structured sample
  const [analysisData, setAnalysisData] = useState<MeetingAnalysisResult>({
    meeting_title: 'Project Sync Meeting',
    meeting_objective: 'Complete dashboard redesign and align project development priorities.',
    summary: 'The team reviewed project deliverables, assigned responsibilities for dashboard redesign, API integration, and testing, postponed mobile development to Phase 2, and agreed to prioritize application performance improvements.',
    discussion_points: [
      'Dashboard redesign deadline targeting completion before July 30.',
      'API integration progress and timeline assigned to Bob for next Tuesday.',
      'Testing report preparation by Charlie by Friday.',
      'Mobile development feature postponement to Phase 2.',
      'Application performance optimization identified by David.'
    ],
    decisions: [
      { title: 'Dashboard redesign must finish before July 30.', status: 'Approved', impact: 'Key Release Goal' },
      { title: 'Mobile development is postponed to Phase 2.', status: 'Delayed', impact: 'Capacity Management' },
      { title: 'Performance optimization prioritized after current deliverables.', status: 'Approved', impact: 'Quality & Speed' }
    ],
    risks: [
      'Performance improvements may delay future features if not scoped properly.',
      'Mobile postponement may affect mobile user adoption in Q3.'
    ],
    open_questions: [
      'What specific performance metrics should be targeted for optimization?',
      'When exactly will Phase 2 begin?'
    ],
    action_items: [
      { task: 'Complete dashboard redesign', owner: 'Alice', due_date: 'July 30', priority: 'High', status: 'Pending' },
      { task: 'Finish API integration', owner: 'Bob', due_date: 'Next Tuesday', priority: 'High', status: 'Pending' },
      { task: 'Prepare testing report', owner: 'Charlie', due_date: 'Friday', priority: 'Medium', status: 'Pending' },
      { task: 'Review testing report after testing', owner: 'Bob', due_date: 'After testing', priority: 'Medium', status: 'Pending' },
      { task: 'Improve application performance', owner: 'David', due_date: 'Not Specified', priority: 'Medium', status: 'Pending' }
    ]
  });

  const charCount = transcriptText.length;
  const wordCount = transcriptText.trim() ? transcriptText.trim().split(/\s+/).length : 0;

  // Real API call to server
  const handleAnalyze = async () => {
    if (!transcriptText.trim() || transcriptText.trim().length < 10) {
      setErrorMessage('Please enter or paste a meeting transcript with at least 10 characters.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProgressStep(0);

    const stepTimer1 = setTimeout(() => setProgressStep(1), 500);
    const stepTimer2 = setTimeout(() => setProgressStep(2), 1200);
    const stepTimer3 = setTimeout(() => setProgressStep(3), 2000);
    const stepTimer4 = setTimeout(() => setProgressStep(4), 2800);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptText,
          customPrompt: customPrompt.trim() || undefined,
        }),
      });

      const result = await response.json();

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(stepTimer4);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to analyze transcript.');
      }

      setAnalysisData(result.data);
      setActiveTab('summary');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err?.message || 'An error occurred while contacting the AI service.');
    } finally {
      setIsProcessing(false);
      setProgressStep(0);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await readTranscriptFromFile(file);
      setTranscriptText(text);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error reading file.');
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = SAMPLE_TRANSCRIPTS.find((s) => s.id === presetId);
    if (preset) {
      setTranscriptText(preset.content);
      setErrorMessage(null);
    }
  };

  // Action Items modifications
  const handleUpdateActionItem = (index: number, updatedItem: ActionItem) => {
    setAnalysisData((prev) => {
      const updated = [...prev.action_items];
      updated[index] = updatedItem;
      return { ...prev, action_items: updated };
    });
  };

  const handleAddActionItem = (newItem: ActionItem) => {
    setAnalysisData((prev) => ({
      ...prev,
      action_items: [newItem, ...prev.action_items],
    }));
  };

  const handleClearTranscript = () => {
    setTranscriptText('');
    setCustomPrompt('');
    setErrorMessage(null);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#faf8ff] text-[#131b2e]'} font-sans flex flex-col transition-colors duration-200`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 w-full ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-[#c1c6d6]/20'} backdrop-blur-md border-b shadow-sm h-16 flex items-center`}>
        <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white shadow-md shadow-[#1a73e8]/25">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="m9 10 2 2 4-4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#1a73e8]">
                MeetWise AI
              </span>
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#005bbf]/10 text-[#005bbf] hidden sm:inline-block">
              AI Workspace
            </span>
          </div>

          {/* Navigation Links with Home button at the beginning */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigateSection?.() || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-[#414754] hover:text-[#005bbf]'} transition-colors font-medium cursor-pointer`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigateSection?.('features') || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-[#414754] hover:text-[#005bbf]'} transition-colors font-medium cursor-pointer`}
            >
              Features
            </button>
            <button
              onClick={() => onNavigateSection?.('workflow') || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-[#414754] hover:text-[#005bbf]'} transition-colors font-medium cursor-pointer`}
            >
              Workflow
            </button>
            <button
              onClick={() => onNavigateSection?.('demo') || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-[#414754] hover:text-[#005bbf]'} transition-colors font-medium cursor-pointer`}
            >
              Demo
            </button>
            <button
              onClick={() => onNavigateSection?.('faq') || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-[#414754] hover:text-[#005bbf]'} transition-colors font-medium cursor-pointer`}
            >
              Docs
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Preset Selector */}
            <div className="hidden xl:flex items-center gap-2 text-xs">
              <span className="text-[#727785] font-medium">Sample:</span>
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs ${
                  isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-[#c1c6d6]/40 text-[#131b2e]'
                } focus:outline-none cursor-pointer`}
              >
                {SAMPLE_TRANSCRIPTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border ${
                isDarkMode ? 'border-slate-700 text-amber-400 hover:bg-slate-800' : 'border-[#c1c6d6]/40 text-[#414754] hover:bg-[#f2f3ff]'
              } transition-colors cursor-pointer`}
              title="Toggle Dark/Light Mode"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Home Page Link */}
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 bg-[#1a73e8] hover:bg-[#005bbf] text-white px-3.5 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Transcript Editor (5 cols) */}
        <section className={`lg:col-span-5 flex flex-col rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#c1c6d6]/30'
        } shadow-sm overflow-hidden min-h-[600px]`}>
          <div className={`p-4 border-b ${
            isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-[#c1c6d6]/20 bg-[#f2f3ff]/40'
          } flex flex-wrap justify-between items-center gap-2`}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005bbf]">description</span>
              <h2 className="font-bold text-base">Transcript Editor</h2>
            </div>

            {/* File Upload Button */}
            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#005bbf]/10 text-[#005bbf] hover:bg-[#005bbf]/20 transition-colors flex items-center gap-1 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                Upload File
                <input
                  type="file"
                  accept=".txt,.vtt,.srt,.md,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleClearTranscript}
                className="px-2 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear Editor"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col space-y-3">
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                <div className="flex-1">
                  <p className="font-bold">Analysis Warning</p>
                  <p>{errorMessage}</p>
                </div>
                <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-700">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}

            {/* Editor Textarea */}
            <textarea
              value={transcriptText}
              onChange={(e) => {
                setTranscriptText(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className={`w-full flex-1 p-4 rounded-xl border ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50/50 border-[#c1c6d6]/30 text-[#131b2e]'
              } font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#005bbf]/50 custom-scrollbar min-h-[300px]`}
              placeholder="Paste your meeting transcript here..."
            />

            {/* Custom Focus Instruction Input */}
            <div>
              <label className="text-[11px] font-bold text-[#727785] dark:text-slate-400 uppercase tracking-wider block mb-1">
                Optional AI Focus Directive
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Focus heavily on owner deadlines and technical risks..."
                className={`w-full p-2.5 text-xs rounded-xl border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-[#c1c6d6]/30'
                } focus:outline-none focus:ring-2 focus:ring-[#005bbf]/50`}
              />
            </div>

            {/* Counters */}
            <div className="flex justify-between items-center text-xs text-[#727785] pt-1">
              <span>{charCount.toLocaleString()} characters</span>
              <span>{wordCount.toLocaleString()} words</span>
            </div>
          </div>

          {/* Analyze Button */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-[#c1c6d6]/20'}`}>
            <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="w-full ai-gradient text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-[#005bbf]/20"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              Analyze Transcript with AI
            </button>
          </div>
        </section>

        {/* Right Panel: AI Insights & Output (7 cols) */}
        <section className={`lg:col-span-7 flex flex-col rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#c1c6d6]/30'
        } shadow-sm overflow-hidden min-h-[600px]`}>
          {/* Tabs Bar */}
          <div className={`px-4 pt-3 border-b ${
            isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-[#c1c6d6]/20 bg-[#f2f3ff]/40'
          } flex items-center gap-2 overflow-x-auto custom-scrollbar`}>
            {[
              { id: 'summary', label: 'Summary', icon: 'description' },
              { id: 'decisions', label: 'Decisions', icon: 'psychology' },
              { id: 'actions', label: `Action Items (${analysisData?.action_items?.length || 0})`, icon: 'task_alt' },
              { id: 'discussion', label: 'Discussion', icon: 'chat' },
              { id: 'json', label: 'JSON', icon: 'data_object' },
              { id: 'markdown', label: 'Markdown', icon: 'markdown' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl flex items-center gap-1.5 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#005bbf] text-[#005bbf] bg-white dark:bg-slate-900 shadow-sm'
                    : 'border-transparent text-[#727785] hover:text-[#131b2e] dark:hover:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Metrics Header Bar */}
          <div className="px-6 py-3 bg-[#e2e7ff]/30 dark:bg-slate-800/40 border-b border-[#c1c6d6]/20 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-[#005bbf] dark:text-blue-400">
                {analysisData?.meeting_title || 'Meeting Analysis'}
              </span>
            </div>
            <div className="flex gap-4 font-medium text-[#414754] dark:text-slate-300">
              <span>Decisions: <strong className="text-[#131b2e] dark:text-white">{analysisData?.decisions?.length || 0}</strong></span>
              <span>Tasks: <strong className="text-[#131b2e] dark:text-white">{analysisData?.action_items?.length || 0}</strong></span>
              <span>Risks: <strong className="text-[#131b2e] dark:text-white">{analysisData?.risks?.length || 0}</strong></span>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {activeTab === 'summary' && (
              <SummaryTab data={analysisData} isDarkMode={isDarkMode} />
            )}

            {activeTab === 'decisions' && (
              <DecisionsCard decisions={analysisData.decisions} isDarkMode={isDarkMode} />
            )}

            {activeTab === 'actions' && (
              <ActionItemsTable
                actionItems={analysisData.action_items}
                onUpdateActionItem={handleUpdateActionItem}
                onAddActionItem={handleAddActionItem}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xs font-bold uppercase text-[#727785] tracking-wider mb-2">
                  Key Discussion Topics
                </h3>
                {analysisData.discussion_points?.map((point, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-[#c1c6d6]/30'
                    } space-y-1`}
                  >
                    <div className="flex justify-between items-center text-xs text-[#727785]">
                      <span className="font-bold text-[#005bbf]">Topic #{idx + 1}</span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-[#414754]'} leading-relaxed`}>
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'json' && (
              <JsonViewer data={analysisData} isDarkMode={isDarkMode} />
            )}

            {activeTab === 'markdown' && (
              <MarkdownViewer data={analysisData} isDarkMode={isDarkMode} />
            )}
          </div>

          {/* Footer Bar */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-[#c1c6d6]/20 bg-[#faf8ff]'
          } flex justify-between items-center`}>
            <span className="text-xs text-[#727785]">
              Structured Output ready for Export
            </span>
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-[#005bbf] hover:bg-[#1a73e8] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Results
            </button>
          </div>
        </section>
      </main>

      {/* AI Processing Modal */}
      {isProcessing && <ProcessingAnimationModal progressStep={progressStep} />}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          data={analysisData}
          transcriptText={transcriptText}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
