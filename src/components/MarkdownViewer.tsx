import React, { useState } from 'react';
import { generateMarkdownReport, downloadFile } from '../utils/fileParsers';

interface MarkdownViewerProps {
  data: any;
  isDarkMode?: boolean;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ data, isDarkMode = false }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const markdownText = generateMarkdownReport(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(markdownText, 'meetwise-summary.md', 'text/markdown');
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-wrap justify-between items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl text-slate-300 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'preview' ? 'bg-[#005bbf] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Formatted Preview
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'raw' ? 'bg-[#005bbf] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Raw Markdown
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1 font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied' : 'Copy MD'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-[#005bbf] hover:bg-[#1a73e8] text-white text-xs rounded-lg flex items-center gap-1 font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">download</span>
            Download .MD
          </button>
        </div>
      </div>

      {/* Content View */}
      {viewMode === 'raw' ? (
        <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto custom-scrollbar leading-relaxed border border-slate-800 max-h-[500px]">
          {markdownText}
        </pre>
      ) : (
        <div
          className={`p-6 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-[#c1c6d6]/30 text-[#131b2e]'
          } space-y-4 text-xs leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar`}
        >
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-xl font-bold mb-1">{data.meeting_title || 'Meeting Summary'}</h1>
            <p className="text-slate-500 font-medium">MeetWise AI Structured Output</p>
          </div>

          {data.meeting_objective && (
            <div>
              <h2 className="text-xs font-bold uppercase text-[#005bbf] tracking-wider mb-1">🎯 Meeting Objective</h2>
              <p className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">{data.meeting_objective}</p>
            </div>
          )}

          {data.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase text-[#005bbf] tracking-wider mb-1">📌 Executive Summary</h2>
              <p className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl leading-relaxed">{data.summary}</p>
            </div>
          )}

          {data.action_items && data.action_items.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase text-[#005bbf] tracking-wider mb-2">🚀 Action Items</h2>
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                    <tr>
                      <th className="p-2.5">Task</th>
                      <th className="p-2.5">Owner</th>
                      <th className="p-2.5">Due Date</th>
                      <th className="p-2.5">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.action_items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium">{item.task}</td>
                        <td className="p-2.5">{item.owner}</td>
                        <td className="p-2.5">{item.due_date}</td>
                        <td className="p-2.5">{item.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
