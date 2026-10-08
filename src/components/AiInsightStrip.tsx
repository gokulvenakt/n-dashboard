import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

export const AiInsightStrip: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[#016D5D]/8 via-[#00E9C9]/10 to-white border border-[#016D5D]/25 rounded-xl p-3.5 shadow-2xs relative transition-all">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#016D5D] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#016D5D] uppercase">
              NEVRIXA INTELLIGENCE
            </span>
            <span className="text-neutral-300 text-xs">·</span>
            <span className="text-[10px] font-mono text-neutral-500 font-medium">
              Real-Time Operational Synthesis
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-neutral-900 font-sans">
            &ldquo;Activity increased 18% across production corridors compared with previous 7 days.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 pt-0.5">
            <span className="flex items-center gap-1 font-medium text-amber-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              3 unusual events detected
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-700 font-medium">2 require immediate attention</span>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-500 font-mono text-[11px]">Chennai & Munich Hubs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
