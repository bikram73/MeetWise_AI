import React from 'react';
import { DecisionItem } from '../types';

interface DecisionsCardProps {
  decisions: (string | DecisionItem)[];
  isDarkMode?: boolean;
}

export const DecisionsCard: React.FC<DecisionsCardProps> = ({ decisions, isDarkMode = false }) => {
  if (!decisions || decisions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs animate-fadeIn">
        No formal decisions were extracted from this transcript.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {decisions.map((item, index) => {
        const isString = typeof item === 'string';
        const title = isString ? item : item.title;
        const status = isString ? 'Approved' : item.status || 'Approved';
        const impact = isString ? null : item.impact;
        const details = isString ? null : item.details;

        const getDecisionStyling = (s: string) => {
          const lower = (s || '').toLowerCase();
          if (lower.includes('delayed') || lower.includes('postponed') || lower.includes('deferred')) {
            return {
              border: 'border-amber-500/30 bg-amber-500/5',
              tag: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
              icon: 'schedule',
              iconColor: 'text-amber-600',
            };
          }
          if (lower.includes('reject') || lower.includes('denied') || lower.includes('canceled')) {
            return {
              border: 'border-red-500/30 bg-red-500/5',
              tag: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
              icon: 'cancel',
              iconColor: 'text-red-600',
            };
          }
          return {
            border: 'border-emerald-500/30 bg-emerald-500/5',
            tag: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
            icon: 'check_circle',
            iconColor: 'text-emerald-600',
          };
        };

        const style = getDecisionStyling(status);

        return (
          <div
            key={index}
            className={`p-4 rounded-2xl border ${style.border} space-y-2 transition-all hover:shadow-sm`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${style.iconColor}`}>
                <span className="material-symbols-outlined text-[16px]">{style.icon}</span>
                {status}
              </span>
              {impact && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.tag}`}>
                  {impact}
                </span>
              )}
            </div>
            <h4 className={`font-bold text-sm leading-snug ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {title}
            </h4>
            {details && (
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {details}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
