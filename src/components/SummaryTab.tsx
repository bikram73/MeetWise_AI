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
      <div className={`p-5 rounded-2xl border-l-4 border-l-[#1a73e8] border ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50/40 border-blue-100'
      } shadow-xs space-y-2.5`}>
        <div className="flex items-center gap-2 text-[#1a73e8] font-bold text-xs uppercase tracking-wider">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          Executive Overview
        </div>
        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {data.summary || 'No executive summary generated.'}
        </p>
      </div>

      {/* Meeting Objective */}
      {data.meeting_objective && (
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        } space-y-1.5 shadow-xs`}>
          <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#1a73e8]">flag</span>
            Meeting Objective
          </h3>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
            {data.meeting_objective}
          </p>
        </div>
      )}

      {/* Discussion Points */}
      {data.discussion_points && data.discussion_points.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#1a73e8]">forum</span>
            Key Discussion Takeaways
          </h3>
          <div className="space-y-2">
            {data.discussion_points.map((point, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-start gap-3 shadow-xs ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[#1a73e8] text-base mt-0.5 shrink-0">
                  check_circle
                </span>
                <span className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
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
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-amber-50/60 border-amber-200'
          } space-y-3 shadow-xs`}>
            <h3 className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
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
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-blue-50/60 border-blue-200'
          } space-y-3 shadow-xs`}>
            <h3 className="text-xs font-bold uppercase text-blue-800 dark:text-blue-400 tracking-wider flex items-center gap-1.5">
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
