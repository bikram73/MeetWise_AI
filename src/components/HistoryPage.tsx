import React, { useState, useEffect } from 'react';
import { HistoryItem, getHistory, deleteHistoryItem, clearAllHistory } from '../utils/historyStorage';
import { MeetingAnalysisResult } from '../types';

interface HistoryPageProps {
  onOpenWorkspaceWithItem: (item: HistoryItem) => void;
  onNavigateLanding: () => void;
  onNavigateWorkspace: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onOpenWorkspaceWithItem,
  onNavigateLanding,
  onNavigateWorkspace,
}) => {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setHistoryList(getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setHistoryList(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleClearAll = () => {
    clearAllHistory();
    setHistoryList([]);
    setSelectedItem(null);
    setShowClearConfirm(false);
  };

  const filteredHistory = historyList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.transcript.toLowerCase().includes(q) ||
      item.result.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-[#131b2e] flex flex-col font-sans">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs h-16 flex items-center">
        <div className="flex justify-between items-center px-4 md:px-10 w-full max-w-[1440px] mx-auto">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={onNavigateLanding}
          >
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center text-white shadow-xs shrink-0">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="m9 10 2 2 4-4" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base md:text-lg font-bold text-[#1a73e8] leading-tight">
                MeetWise AI
              </span>
              <span className="text-[10px] font-semibold text-[#005bbf] tracking-wide leading-none">
                Transcript History
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={onNavigateLanding}
              className="text-xs md:text-sm font-medium text-slate-600 hover:text-[#1a73e8] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={onNavigateWorkspace}
              className="text-xs md:text-sm font-semibold text-[#1a73e8] hover:text-[#1557b0] transition-colors cursor-pointer"
            >
              Workspace
            </button>
            <button
              onClick={onNavigateWorkspace}
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>New Analysis</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 space-y-6">
        {/* Header Title & Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1a73e8]">history</span>
              Transcript Analysis History
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Securely stored in your browser's LocalStorage. All processed meetings and extracts are saved locally.
            </p>
          </div>

          {historyList.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
                <span>Clear All History</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {historyList.length > 0 && (
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous transcripts, topics, tasks, or titles..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs md:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/30 shadow-xs"
            />
          </div>
        )}

        {/* Empty State View */}
        {historyList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs my-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1a73e8] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">history_toggle_off</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">No Transcript History Yet</h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                When you process meeting notes or transcripts in the Workspace, your full structured results, action items, and confidence metrics will automatically appear here.
              </p>
            </div>
            <button
              onClick={onNavigateWorkspace}
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all shadow-md shadow-[#1a73e8]/20 cursor-pointer inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span>Open Workspace & Process a Meeting</span>
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs md:text-sm">
            No history items matched "<span className="font-semibold">{searchQuery}</span>". Try another search term.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#1a73e8]/50 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group cursor-pointer"
                onClick={() => onOpenWorkspaceWithItem(item)}
              >
                <div className="space-y-2.5">
                  {/* Top Meta */}
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Delete from history"
                      className="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm md:text-base text-slate-900 group-hover:text-[#1a73e8] transition-colors line-clamp-1">
                    {item.title || 'Untitled Meeting'}
                  </h3>

                  {/* Summary Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.result.summary || item.transcript}
                  </p>
                </div>

                {/* Bottom Badges & CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      <span className="material-symbols-outlined text-[13px]">task_alt</span>
                      {item.actionItemCount} {item.actionItemCount === 1 ? 'Action' : 'Actions'}
                    </span>
                    {item.decisionCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <span className="material-symbols-outlined text-[13px]">gavel</span>
                        {item.decisionCount}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-[#1a73e8] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Load
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Clear Transcript History?</h3>
              <p className="text-xs text-slate-500">
                This will remove all saved transcripts and extracted results stored in this browser. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-xs"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
