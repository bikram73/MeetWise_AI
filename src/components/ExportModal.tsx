import React, { useState } from 'react';
import { generateMarkdownReport, downloadFile } from '../utils/fileParsers';

interface ExportModalProps {
  data: any;
  transcriptText: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ data, transcriptText, onClose }) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const jsonString = JSON.stringify(data, null, 2);
  const mdString = generateMarkdownReport(data);

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 animate-scaleUp">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005bbf]">download</span>
            <h3 className="text-lg font-bold text-[#131b2e]">Export Results</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-[#727785] uppercase tracking-wider block">
            Select Output Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-[#c1c6d6]/40 bg-white shadow-xs text-center space-y-2 flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-[#005bbf] text-2xl block mb-1">data_object</span>
                <span className="text-xs font-bold block text-slate-800">JSON Data</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                <button
                  onClick={() => downloadFile(jsonString, 'meetwise-data.json', 'application/json')}
                  className="w-full bg-[#005bbf] text-white py-1.5 rounded-lg text-[11px] font-bold hover:bg-[#1a73e8] cursor-pointer"
                >
                  Download .JSON
                </button>
                <button
                  onClick={() => triggerCopy(jsonString, 'json')}
                  className="w-full border border-slate-200 text-slate-700 py-1 rounded-lg text-[10px] font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {copyStatus === 'json' ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#c1c6d6]/40 bg-white shadow-xs text-center space-y-2 flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-[#732de4] text-2xl block mb-1">markdown</span>
                <span className="text-xs font-bold block text-slate-800">Markdown</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                <button
                  onClick={() => downloadFile(mdString, 'meetwise-summary.md', 'text/markdown')}
                  className="w-full bg-[#732de4] text-white py-1.5 rounded-lg text-[11px] font-bold hover:opacity-90 cursor-pointer"
                >
                  Download .MD
                </button>
                <button
                  onClick={() => triggerCopy(mdString, 'md')}
                  className="w-full border border-slate-200 text-slate-700 py-1 rounded-lg text-[10px] font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {copyStatus === 'md' ? 'Copied!' : 'Copy MD'}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#c1c6d6]/40 bg-white shadow-xs text-center space-y-2 flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-[#005ac1] text-2xl block mb-1">description</span>
                <span className="text-xs font-bold block text-slate-800">Raw Text</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                <button
                  onClick={() => downloadFile(transcriptText, 'raw-transcript.txt', 'text/plain')}
                  className="w-full bg-[#005ac1] text-white py-1.5 rounded-lg text-[11px] font-bold hover:opacity-90 cursor-pointer"
                >
                  Download .TXT
                </button>
                <button
                  onClick={() => triggerCopy(transcriptText, 'txt')}
                  className="w-full border border-slate-200 text-slate-700 py-1 rounded-lg text-[10px] font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {copyStatus === 'txt' ? 'Copied!' : 'Copy TXT'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#c1c6d6]/30 p-4 rounded-xl text-xs text-[#414754] space-y-1">
          <p className="font-bold text-[#131b2e]">API & Integrations</p>
          <p>Export files are ready for instant import into Notion, Jira, Slack, or GitHub Wikis.</p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#c1c6d6]/40 font-bold text-xs text-[#414754] hover:bg-slate-50 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
