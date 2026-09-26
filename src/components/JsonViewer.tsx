import React, { useState } from 'react';
import { downloadFile } from '../utils/fileParsers';

interface JsonViewerProps {
  data: any;
  isDarkMode?: boolean;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(jsonString, 'meetwise-analysis.json', 'application/json');
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex justify-between items-center bg-slate-900 px-4 py-2 rounded-xl text-slate-300 text-xs">
        <span className="font-mono flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">data_object</span>
          application/json
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1 font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-[#005bbf] hover:bg-[#1a73e8] text-white text-xs rounded-lg flex items-center gap-1 font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">download</span>
            Download
          </button>
        </div>
      </div>

      <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto custom-scrollbar leading-relaxed border border-slate-800 max-h-[500px]">
        {jsonString}
      </pre>
    </div>
  );
};
