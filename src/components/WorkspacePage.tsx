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
  const [analysisNotice, setAnalysisNotice] = useState<string | null>(null);

  // Default transcript initially empty as requested
  const [transcriptText, setTranscriptText] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Analysis result state initialized to null until a transcript is analyzed
  const [analysisData, setAnalysisData] = useState<MeetingAnalysisResult | null>(null);

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
      if (result.notice) {
        setAnalysisNotice(result.notice);
      } else {
        setAnalysisNotice(null);
      }
      setErrorMessage(null);
      setActiveTab('summary');
    } catch (err: any) {
      console.error('Analysis error:', err);
      let msg = err?.message || 'An error occurred while contacting the AI service.';
      if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
        msg = 'Free-tier AI request limit was momentarily reached. Please wait ~20 seconds before retrying.';
      }
      setErrorMessage(msg);
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
      if (!prev) return prev;
      const updated = [...prev.action_items];
      updated[index] = updatedItem;
      return { ...prev, action_items: updated };
    });
  };

  const handleAddActionItem = (newItem: ActionItem) => {
    setAnalysisData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        action_items: [newItem, ...prev.action_items],
      };
    });
  };

  const handleClearTranscript = () => {
    setTranscriptText('');
    setCustomPrompt('');
    setSelectedPresetId(null);
    setAnalysisData(null);
    setErrorMessage(null);
    setAnalysisNotice(null);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50/60 text-slate-900'} font-sans flex flex-col transition-colors duration-200`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 w-full ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200/80'} backdrop-blur-md border-b shadow-xs h-16 flex items-center`}>
        <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white shadow-md shadow-[#1a73e8]/25 shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="m9 10 2 2 4-4" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg md:text-xl font-bold text-[#1a73e8] leading-tight">
                  MeetWise AI
                </span>
                <span className="text-[10px] md:text-[11px] font-semibold text-[#005bbf] tracking-wide leading-none">
                  AI Workspace
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links with Home button at the beginning */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigateSection?.() || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#1a73e8]'} transition-colors font-medium cursor-pointer`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigateSection?.('features') || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#1a73e8]'} transition-colors font-medium cursor-pointer`}
            >
              Features
            </button>
            <button
              onClick={() => onNavigateSection?.('workflow') || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#1a73e8]'} transition-colors font-medium cursor-pointer`}
            >
              Workflow
            </button>
            <button
              onClick={() => onNavigateSection?.('demo') || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#1a73e8]'} transition-colors font-medium cursor-pointer`}
            >
              Demo
            </button>
            <button
              onClick={() => onNavigateSection?.('faq') || onBackToLanding()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#1a73e8]'} transition-colors font-medium cursor-pointer`}
            >
              Docs
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* New Meeting action */}
            <button
              onClick={handleClearTranscript}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                isDarkMode
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              } transition-colors cursor-pointer shadow-xs`}
              title="Start a new meeting transcript"
            >
              <span className="material-symbols-outlined text-[16px] text-[#1a73e8]">add_circle</span>
              <span>New Meeting</span>
            </button>

            {/* Export button */}
            <button
              onClick={() => {
                if (!analysisData) {
                  setErrorMessage('Please analyze a transcript before exporting.');
                  return;
                }
                setShowExportModal(true);
              }}
              className="inline-flex items-center gap-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Transcript Editor (5 cols) */}
        <section className={`lg:col-span-5 flex flex-col rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        } shadow-xs overflow-hidden min-h-[600px]`}>
          <div className={`px-5 py-3.5 border-b ${
            isDarkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50/70'
          } flex flex-wrap justify-between items-center gap-2`}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1a73e8]">description</span>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Transcript Editor</h2>
            </div>

            {/* File Upload Button */}
            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
                <span className="material-symbols-outlined text-[16px] text-[#1a73e8]">upload_file</span>
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
                className="px-2 py-1 text-xs font-medium text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                title="Clear Editor"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col space-y-3">
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5 text-red-600">error</span>
                <div className="flex-1">
                  <p className="font-bold">Notice</p>
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
                if (selectedPresetId) setSelectedPresetId(null);
                if (errorMessage) setErrorMessage(null);
              }}
              className={`w-full p-4 rounded-xl border ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
              } font-mono text-xs leading-relaxed resize-none focus:outline-none focus:border-[#1a73e8] focus:ring-4 focus:ring-[#1a73e8]/10 custom-scrollbar min-h-[190px] placeholder:text-slate-400`}
              placeholder="Paste your meeting transcript here, or pick one of the 5 samples below..."
            />

            {/* Counters and Clear */}
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              <span>{charCount.toLocaleString()} characters · {wordCount.toLocaleString()} words</span>
              {transcriptText && (
                <button
                  type="button"
                  onClick={handleClearTranscript}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">backspace</span>
                  Clear Text
                </button>
              )}
            </div>

            {/* 5 Sample Transcripts down below the textarea */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#1a73e8]">dataset</span>
                  Sample Transcripts (5 Available)
                </label>
                {selectedPresetId && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Sample Loaded
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_TRANSCRIPTS.map((sample, idx) => {
                  const isSelected = selectedPresetId === sample.id;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectPreset(sample.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        idx === 4 ? 'sm:col-span-2' : ''
                      } ${
                        isSelected
                          ? 'border-[#1a73e8] bg-blue-50/60 dark:bg-blue-950/40 text-[#1a73e8] ring-1 ring-[#1a73e8]/40 shadow-xs'
                          : isDarkMode
                          ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#1a73e8] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#1a73e8]' : 'text-slate-900 dark:text-slate-100'}`}>
                            {sample.title}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium shrink-0">
                            {sample.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {sample.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Focus Instruction Input */}
            <div className="pt-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Optional AI Focus Directive
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Focus heavily on owner deadlines and technical risks..."
                className={`w-full p-2.5 text-xs rounded-xl border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
                } focus:outline-none focus:border-[#1a73e8] focus:ring-4 focus:ring-[#1a73e8]/10 placeholder:text-slate-400`}
              />
            </div>
          </div>

          {/* Analyze Button */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#1a73e8] to-[#1557b0] hover:from-[#1557b0] hover:to-[#0d47a1] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer"
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
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        } shadow-xs overflow-hidden min-h-[600px]`}>
          {/* Tabs Bar */}
          <div className={`px-4 pt-2.5 border-b ${
            isDarkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50/70'
          } flex items-center gap-1.5 overflow-x-auto custom-scrollbar`}>
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
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? isDarkMode
                      ? 'bg-slate-800 text-blue-400 shadow-sm border border-slate-700'
                      : 'bg-white text-[#1a73e8] shadow-xs border border-slate-200/90 font-bold'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span className={`material-symbols-outlined text-[17px] ${activeTab === tab.id ? 'text-[#1a73e8] dark:text-blue-400' : 'text-slate-400'}`}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Metrics Header Bar */}
          <div className={`px-5 py-2.5 border-b ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200/80 text-slate-700'
          } flex flex-wrap items-center justify-between text-xs gap-3`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {analysisData?.meeting_title || 'Meeting Analysis'}
              </span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
                Decisions: <strong className="text-slate-900 dark:text-white ml-0.5">{analysisData?.decisions?.length || 0}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/50">
                Tasks: <strong className="text-blue-900 dark:text-white ml-0.5">{analysisData?.action_items?.length || 0}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-900/50">
                Risks: <strong className="text-amber-900 dark:text-white ml-0.5">{analysisData?.risks?.length || 0}</strong>
              </span>
            </div>
          </div>

          {/* Analysis Notice Alert */}
          {analysisNotice && (
            <div className="mx-6 mt-4 p-3 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#1a73e8] dark:text-blue-300 rounded-xl text-xs flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">offline_bolt</span>
                <span>{analysisNotice}</span>
              </div>
              <button onClick={() => setAnalysisNotice(null)} className="text-blue-400 hover:text-blue-600 cursor-pointer">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* Tab Content Body */}
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {!analysisData ? (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-5 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 text-[#1a73e8] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                </div>
                <div className="max-w-md space-y-1.5">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Ready for Transcript Analysis
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Choose one of the sample meetings below or paste your own transcript into the editor on the left to extract structured summaries, decisions, action items, and risks.
                  </p>
                </div>
                <div className="pt-2 w-full max-w-lg space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block text-left">
                    Quick-Load Sample Meetings
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {SAMPLE_TRANSCRIPTS.map((sample, idx) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectPreset(sample.id)}
                        className={`p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-[#1a73e8] hover:bg-blue-50/40 transition-all shadow-xs cursor-pointer flex items-start gap-2.5 ${
                          idx === 4 ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <span className="w-5 h-5 rounded-md bg-blue-50 dark:bg-slate-700 text-[#1a73e8] dark:text-blue-400 text-[11px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {sample.title}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium shrink-0">
                              {sample.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {sample.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
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
                    <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2">
                      Key Discussion Topics
                    </h3>
                    {analysisData.discussion_points?.map((point, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border ${
                          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                        } space-y-1 shadow-xs`}
                      >
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span className="font-bold text-[#1a73e8]">Topic #{idx + 1}</span>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
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
              </>
            )}
          </div>

          {/* Footer Bar */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'
          } flex justify-between items-center`}>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {analysisData ? 'Structured Output ready for Export' : 'Select a sample or paste transcript to begin'}
            </span>
            <button
              onClick={() => {
                if (!analysisData) {
                  setErrorMessage('Please analyze a transcript before exporting.');
                  return;
                }
                setShowExportModal(true);
              }}
              disabled={!analysisData}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shadow-xs ${
                analysisData
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
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
