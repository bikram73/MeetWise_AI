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
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Transcript Editor (5 cols) */}
        <section className={`lg:col-span-5 flex flex-col rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        } shadow-sm overflow-hidden`}>
          <div className={`px-5 py-4 border-b ${
            isDarkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-100 bg-slate-50/60'
          } flex flex-wrap justify-between items-center gap-2`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-white leading-none">Transcript Editor</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Paste dialogue or pick a sample</p>
              </div>
            </div>

            {/* File Upload Button & Clear */}
            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
                <span className="material-symbols-outlined text-[16px] text-blue-600">upload_file</span>
                Upload File
                <input
                  type="file"
                  accept=".txt,.vtt,.srt,.md,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {transcriptText && (
                <button
                  onClick={handleClearTranscript}
                  className="px-2 py-1 text-xs font-medium text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                  title="Clear Editor"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col space-y-3.5">
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5 text-red-600">error</span>
                <div className="flex-1">
                  <p className="font-bold">Notice</p>
                  <p>{errorMessage}</p>
                </div>
                <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-700 cursor-pointer">
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
              rows={8}
              className={`w-full p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500'
                  : 'bg-slate-50/50 focus:bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
              } font-sans text-sm leading-relaxed resize-none focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 custom-scrollbar transition-all min-h-[190px]`}
              placeholder="Paste your meeting transcript here (e.g. 'Alice: We need to complete redesign before July 30...'), or select one of the 5 samples below..."
            />

            {/* Counters and Clear */}
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>
                {charCount > 0 ? (
                  <>
                    <strong className="text-slate-700 dark:text-slate-200 font-semibold">{charCount.toLocaleString()}</strong> characters · <strong className="text-slate-700 dark:text-slate-200 font-semibold">{wordCount.toLocaleString()}</strong> words
                  </>
                ) : (
                  'Editor ready for input'
                )}
              </span>
              {selectedPresetId && (
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-200 dark:border-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Sample Loaded
                </span>
              )}
            </div>

            {/* 5 Sample Transcripts down below the textarea */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-blue-600">dataset</span>
                  Sample Transcripts (5 Available)
                </label>
                <span className="text-[10px] text-slate-400">Click to load</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLE_TRANSCRIPTS.map((sample, idx) => {
                  const isSelected = selectedPresetId === sample.id;
                  const getCategoryColor = (cat: string) => {
                    const c = cat.toLowerCase();
                    if (c.includes('eng')) return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
                    if (c.includes('strat')) return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300';
                    if (c.includes('agile') || c.includes('devops')) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
                    if (c.includes('market') || c.includes('sales')) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
                    return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
                  };

                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectPreset(sample.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        idx === 4 ? 'sm:col-span-2' : ''
                      } ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/30 shadow-xs'
                          : isDarkMode
                          ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                            {sample.title}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold border shrink-0 ${getCategoryColor(sample.category)}`}>
                            {sample.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {sample.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Focus Instruction Input */}
            <div className="pt-1 space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block px-1">
                Optional AI Focus Directive
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                  tune
                </span>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Prioritize deadlines, technical risks, and SAML blockers..."
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border ${
                    isDarkMode
                      ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
                      : 'bg-slate-50/50 focus:bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  } focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all`}
                />
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/50'}`}>
            <button
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span>Analyze Transcript with AI</span>
            </button>
          </div>
        </section>

        {/* Right Panel: AI Insights & Output (7 cols) */}
        <section className={`lg:col-span-7 flex flex-col rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        } shadow-sm overflow-hidden min-h-[600px]`}>
          {/* Tabs Bar */}
          <div className={`px-4 pt-2.5 border-b ${
            isDarkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-100 bg-slate-50/60'
          } flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar`}>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'summary', label: 'Summary', icon: 'description' },
                { id: 'decisions', label: 'Decisions', icon: 'psychology' },
                { id: 'actions', label: `Action Items (${analysisData?.action_items?.length || 0})`, icon: 'task_alt' },
                { id: 'discussion', label: 'Discussion', icon: 'forum' },
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
                        : 'bg-white text-blue-600 shadow-xs border border-slate-200 font-bold'
                      : isDarkMode
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {analysisData && (
              <button
                onClick={() => setShowExportModal(true)}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Export</span>
              </button>
            )}
          </div>

          {/* Quick Metrics Header Bar (only shown when data exists) */}
          {analysisData && (
            <div className={`px-6 py-2.5 border-b ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-white border-slate-100 text-slate-700'
            } flex flex-wrap items-center justify-between text-xs gap-3`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {analysisData.meeting_title || 'Meeting Analysis'}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                  Decisions: <strong className="text-slate-900 dark:text-white ml-0.5">{analysisData.decisions?.length || 0}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50">
                  Tasks: <strong className="text-blue-900 dark:text-white ml-0.5">{analysisData.action_items?.length || 0}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/50">
                  Risks: <strong className="text-amber-900 dark:text-white ml-0.5">{analysisData.risks?.length || 0}</strong>
                </span>
              </div>
            </div>
          )}

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
              <div className="h-full min-h-[460px] flex flex-col items-center justify-center text-center p-4 sm:p-8 space-y-6 animate-fadeIn">
                <div className="space-y-3 max-w-lg mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>AI Meeting Intelligence Workspace</span>
                  </div>
                  <h3 className="font-bold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                    Turn Dialogue into Actionable Intelligence
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Paste raw transcripts or pick any sample on the left, then click <strong>"Analyze Transcript with AI"</strong> to extract clean summaries, owner assignments, deadlines, and key decisions.
                  </p>
                </div>

                {/* 4 Feature Preview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl text-left">
                  <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                      <span className="material-symbols-outlined text-[18px]">description</span>
                      <span>Executive Summary</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Synthesizes hours of rambling speech into clear takeaways and primary objectives.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs">
                      <span className="material-symbols-outlined text-[18px]">psychology</span>
                      <span>Decision Tracker</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Catalogs formal agreements, deferred initiatives, and stakeholder consensus.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                      <span className="material-symbols-outlined text-[18px]">task_alt</span>
                      <span>Smart Action Items</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Detects assignees, explicit due dates, and urgency levels with editable statuses.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
                      <span className="material-symbols-outlined text-[18px]">file_download</span>
                      <span>Universal Export</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Instant export to formatted Markdown, clean JSON, PDF report, or clipboard.
                    </p>
                  </div>
                </div>

                {/* Quick Start Action Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(SAMPLE_TRANSCRIPTS[0].id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-all cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                    <span>Load Project Sync Sample (#1) to Preview</span>
                  </button>
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
            isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/60'
          } flex justify-between items-center`}>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {analysisData ? 'Structured analysis ready for team sharing and export' : 'Waiting for transcript input'}
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
              className={`px-5 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shadow-xs ${
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
