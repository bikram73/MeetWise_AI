import React from 'react';

interface ProcessingAnimationModalProps {
  progressStep: number;
}

export const ProcessingAnimationModal: React.FC<ProcessingAnimationModalProps> = ({ progressStep }) => {
  const steps = [
    { title: 'Reading Transcript', desc: 'Parsing text and cleaning formatting' },
    { title: 'Understanding Context', desc: 'Analyzing discussion flow and objectives' },
    { title: 'Finding Decisions', desc: 'Identifying agreed items, postponements, and rejections' },
    { title: 'Extracting Tasks', desc: 'Mapping owners, deadlines, and priorities' },
    { title: 'Formatting Output', desc: 'Structuring JSON payload and markdown views' },
  ];

  const currentPercent = Math.min(Math.round(((progressStep + 1) / steps.length) * 100), 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-6 animate-scaleUp">
        {/* Animated Brain / Gem Logo */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#005bbf] to-[#732de4] animate-ping opacity-25"></div>
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#005bbf] to-[#732de4] flex items-center justify-center text-white shadow-xl">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#131b2e] dark:text-white">Analyzing Meeting Data</h3>
          <p className="text-xs text-[#727785] dark:text-slate-400 mt-1">Powered by Advanced AI Intelligence</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-500">
            <span>Processing Timeline</span>
            <span>{currentPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#005bbf] via-[#732de4] to-[#10b981] h-full transition-all duration-500 rounded-full"
              style={{ width: `${currentPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="space-y-3 text-left">
          {steps.map((step, idx) => {
            const isDone = progressStep > idx;
            const isCurrent = progressStep === idx;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 transition-all duration-300 ${
                  isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isCurrent
                    ? 'text-[#005bbf] dark:text-blue-400 font-bold'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <span className="material-symbols-outlined text-base">check_circle</span>
                  ) : isCurrent ? (
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-base">radio_button_unchecked</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold leading-none">{step.title}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
