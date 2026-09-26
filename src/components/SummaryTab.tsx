import React from 'react';
import { MeetingAnalysisResult } from '../types';

interface SummaryTabProps {
  data: MeetingAnalysisResult;
  isDarkMode?: boolean;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ data, isDarkMode = false }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Executive Summary Banner */}
      <div className={`p-5 rounded-2xl border-l-4 border-[#005bbf] ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-[#faf8ff] border-[#c1c6d6]/30'
      } shadow-sm space-y-3`}>
        <div className="flex items-center gap-2 text-[#005bbf] font-bold text-sm">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          Executive Overview
        </div>
        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-[#414754]'}`}>
          {data.summary || 'No executive summary generated.'}
        </p>
      </div>

      {/* Meeting Objective */}
      {data.meeting_objective && (
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#c1c6d6]/30'
        } space-y-2`}>
          <h3 className="text-xs font-bold uppercase text-[#727785] tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#005bbf]">flag</span>
            Meeting Objective
          </h3>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-[#131b2e]'}`}>
            {data.meeting_objective}
          </p>
        </div>
      )}

      {/* Discussion Points */}
      {data.discussion_points && data.discussion_points.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-[#727785] tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#005bbf]">forum</span>
            Key Discussion Takeaways
          </h3>
          <div className="space-y-2">
            {data.discussion_points.map((point, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-[#c1c6d6]/20'
                }`}
              >
                <span className="material-symbols-outlined text-[#005bbf] text-base mt-0.5 shrink-0">
                  check_circle
                </span>
                <span className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-[#414754]'}`}>
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Risks & Open Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risks */}
        {data.risks && data.risks.length > 0 && (
          <div className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-amber-50/40 border-amber-200/60'
          } space-y-3`}>
            <h3 className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              Risks & Bottlenecks
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {data.risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Open Questions */}
        {data.open_questions && data.open_questions.length > 0 && (
          <div className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-blue-50/40 border-blue-200/60'
          } space-y-3`}>
            <h3 className="text-xs font-bold uppercase text-blue-700 dark:text-blue-400 tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">help_outline</span>
              Open Questions
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {data.open_questions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
