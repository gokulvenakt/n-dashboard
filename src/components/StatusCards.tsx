import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Finding } from '../types/findings';

interface StatusCardsProps {
  findings: Finding[];
  selectedCategory: 'ALL' | 'ATTENTION' | 'CRITICAL' | 'RESOLVED';
  onSelectCategory: (category: 'ALL' | 'ATTENTION' | 'CRITICAL' | 'RESOLVED') => void;
}

export const StatusCards: React.FC<StatusCardsProps> = ({
  findings,
  selectedCategory,
  onSelectCategory,
}) => {
  const attentionCount = findings.filter((f) => f.statusCategory === 'ATTENTION').length;
  const criticalCount = findings.filter((f) => f.statusCategory === 'CRITICAL').length;
  const resolvedCount = findings.filter((f) => f.statusCategory === 'RESOLVED').length;

  const cards = [
    {
      id: 'ATTENTION' as const,
      label: 'Attention',
      caption: 'Requires Review',
      subCaption: 'Threshold anomalies',
      count: attentionCount,
      icon: AlertTriangle,
      delta: '+12% vs 7d avg',
      isIncrease: true,
      colorTheme: {
        border: 'border-amber-300/80',
        activeBorder: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/70',
        hoverBorder: 'hover:border-amber-400 hover:bg-amber-50/50',
        cardBg: 'bg-white',
        iconBg: 'bg-amber-100/90 text-amber-800 border border-amber-300',
        textCount: 'text-amber-950',
        textLabel: 'text-amber-900',
        captionText: 'text-amber-700/90',
        lineColor: '#D97706',
        gradientStart: 'rgba(245, 158, 11, 0.22)',
        gradientEnd: 'rgba(254, 243, 199, 0.02)',
      },
      // Sparkline points for Attention curve
      linePath: 'M 0 52 C 40 48, 70 32, 110 38 C 150 44, 180 20, 220 26 C 260 32, 300 15, 340 18 L 340 80 L 0 80 Z',
      strokePath: 'M 0 52 C 40 48, 70 32, 110 38 C 150 44, 180 20, 220 26 C 260 32, 300 15, 340 18',
    },
    {
      id: 'CRITICAL' as const,
      label: 'Critical',
      caption: 'Immediate Action',
      subCaption: 'Perimeter & safety breaches',
      count: criticalCount,
      icon: AlertOctagon,
      delta: '3 high priority',
      isIncrease: true,
      colorTheme: {
        border: 'border-red-300/80',
        activeBorder: 'border-red-500 ring-2 ring-red-500/20 bg-red-50/70',
        hoverBorder: 'hover:border-red-400 hover:bg-red-50/50',
        cardBg: 'bg-white',
        iconBg: 'bg-red-100/90 text-red-800 border border-red-300',
        textCount: 'text-red-950',
        textLabel: 'text-red-900',
        captionText: 'text-red-700/90',
        lineColor: '#DC2626',
        gradientStart: 'rgba(239, 68, 68, 0.24)',
        gradientEnd: 'rgba(254, 226, 226, 0.02)',
      },
      // Sparkline points for Critical curve with sharp alarm spikes
      linePath: 'M 0 60 C 50 58, 90 42, 130 52 C 170 62, 200 18, 240 14 C 280 10, 310 30, 340 22 L 340 80 L 0 80 Z',
      strokePath: 'M 0 60 C 50 58, 90 42, 130 52 C 170 62, 200 18, 240 14 C 280 10, 310 30, 340 22',
    },
    {
      id: 'RESOLVED' as const,
      label: 'Resolved',
      caption: 'Operations Cleared',
      subCaption: 'Verified by operators',
      count: resolvedCount,
      icon: CheckCircle2,
      delta: '98.4% clearance',
      isIncrease: false,
      colorTheme: {
        border: 'border-[#016D5D]/30',
        activeBorder: 'border-[#016D5D] ring-2 ring-[#016D5D]/20 bg-[#E6F4F1]',
        hoverBorder: 'hover:border-[#016D5D]/60 hover:bg-[#E6F4F1]/50',
        cardBg: 'bg-white',
        iconBg: 'bg-[#E6F4F1] text-[#016D5D] border border-[#016D5D]/25',
        textCount: 'text-neutral-900',
        textLabel: 'text-[#016D5D]',
        captionText: 'text-[#016D5D]/80',
        lineColor: '#016D5D',
        gradientStart: 'rgba(1, 109, 93, 0.22)',
        gradientEnd: 'rgba(230, 244, 241, 0.02)',
      },
      // Sparkline points for Resolved steady upward resolution curve
      linePath: 'M 0 65 C 50 60, 100 48, 150 42 C 200 36, 250 24, 300 16 C 320 12, 335 10, 340 8 L 340 80 L 0 80 Z',
      strokePath: 'M 0 65 C 50 60, 100 48, 150 42 C 200 36, 250 24, 300 16 C 320 12, 335 10, 340 8',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = selectedCategory === c.id;

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectCategory(isSelected ? 'ALL' : c.id)}
            className={`w-full text-left p-3.5 sm:p-4 rounded-xl border relative overflow-hidden transition-all duration-150 cursor-pointer select-none flex flex-col justify-between shadow-2xs group ${
              c.colorTheme.cardBg
            } ${
              isSelected
                ? c.colorTheme.activeBorder
                : `border-[#E5E7EB] ${c.colorTheme.hoverBorder}`
            }`}
          >
            {/* 
              BACKGROUND LINE GRAPH & LIGHT GRADIENT AREA MATCHING CAPTION
              Positioned behind card content for sleek enterprise telemetry look
            */}
            <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg
                viewBox="0 0 340 80"
                className="w-full h-full"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`grad-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.colorTheme.gradientStart} />
                    <stop offset="100%" stopColor={c.colorTheme.gradientEnd} />
                  </linearGradient>
                </defs>
                {/* Light Gradient Area Fill below the line graph */}
                <path d={c.linePath} fill={`url(#grad-${c.id})`} />
                {/* Foreground Crisp Sparkline Stroke */}
                <path
                  d={c.strokePath}
                  fill="none"
                  stroke={c.colorTheme.lineColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              </svg>
            </div>

            {/* TOP ROW: Icon, Status Label & Metric Trend Badge */}
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${c.colorTheme.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <div className={`text-xs font-bold uppercase tracking-wider ${c.colorTheme.textLabel}`}>
                    {c.label}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-medium">
                    {c.caption}
                  </div>
                </div>
              </div>

              {/* Status Delta Pill */}
              <div className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/90 border border-neutral-200/80 shadow-2xs shrink-0">
                <Activity className="w-3 h-3 text-neutral-500" />
                <span className="font-semibold text-neutral-700">{c.delta}</span>
              </div>
            </div>

            {/* BOTTOM ROW: Large High-Contrast Count & Contextual Subcaption */}
            <div className="relative z-10 mt-3 pt-2 border-t border-neutral-100 flex items-end justify-between">
              <div>
                <span className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight ${c.colorTheme.textCount}`}>
                  {c.count.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono ml-1.5">events</span>
              </div>

              <span className={`text-[10px] font-mono ${c.colorTheme.captionText} pb-0.5`}>
                {c.subCaption}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
