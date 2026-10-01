import React, { useState, useMemo } from 'react';
import { Finding } from '../types/findings';
import { CCTVPlayer } from './CCTVPlayer';
import {
  TrendingUp,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Camera,
  Activity,
  ArrowUpRight,
  Sparkles,
  Workflow,
  Radio,
  CheckCircle2,
  Building2,
  Eye,
  Server,
  Clock,
  Flame,
  Users,
  ShieldAlert,
  Check,
  Layers,
  Zap,
} from 'lucide-react';

interface OverviewViewProps {
  findings: Finding[];
  onNavigateToFindings: () => void;
  onSelectFinding: (finding: Finding) => void;
  selectedSite?: string;
  onSelectSite?: (siteId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  findings,
  onNavigateToFindings,
  onSelectFinding,
  selectedSite = 'all',
  onSelectSite,
}) => {
  const [activeSiteFilter, setActiveSiteFilter] = useState<string>(selectedSite);
  const [activeTimeRange, setActiveTimeRange] = useState<'today' | '7d' | '30d'>('today');
  const [selectedMetricCard, setSelectedMetricCard] = useState<string | null>(null);

  // Synchronize internal filter with parent if prop changes
  React.useEffect(() => {
    setActiveSiteFilter(selectedSite);
  }, [selectedSite]);

  const handleSiteChange = (siteId: string) => {
    setActiveSiteFilter(siteId);
    if (onSelectSite) {
      onSelectSite(siteId);
    }
  };

  // Facility Site Definitions with Live Telemetry Metadata
  const facilitySites = [
    {
      id: 'all',
      name: 'All Facilities',
      siteCode: 'GLOBAL',
      city: 'Global Operations',
      camerasTotal: 142,
      camerasOnline: 142,
      threatLevel: 'ELEVATED',
      threatColor: 'text-amber-800 bg-amber-50 border-amber-300',
      activeIncidents: 3,
      edgeLatency: '14.2ms',
      bandwidth: '840 Mbps',
    },
    {
      id: 'chennai',
      name: 'Chennai Facility',
      siteCode: 'CHN-01',
      city: 'Tamil Nadu, India',
      camerasTotal: 48,
      camerasOnline: 48,
      threatLevel: 'ELEVATED',
      threatColor: 'text-amber-800 bg-amber-50 border-amber-300',
      activeIncidents: 2,
      edgeLatency: '13.8ms',
      bandwidth: '310 Mbps',
    },
    {
      id: 'munich',
      name: 'Munich Facility',
      siteCode: 'MUC-02',
      city: 'Bavaria, Germany',
      camerasTotal: 36,
      camerasOnline: 36,
      threatLevel: 'GUARDED',
      threatColor: 'text-red-800 bg-red-50 border-red-300',
      activeIncidents: 1,
      edgeLatency: '12.4ms',
      bandwidth: '240 Mbps',
    },
    {
      id: 'singapore',
      name: 'Singapore Hub',
      siteCode: 'SIN-03',
      city: 'Tuas Logistics, SG',
      camerasTotal: 32,
      camerasOnline: 32,
      threatLevel: 'NORMAL',
      threatColor: 'text-[#016D5D] bg-[#E6F4F1] border-[#016D5D]/30',
      activeIncidents: 0,
      edgeLatency: '11.9ms',
      bandwidth: '180 Mbps',
    },
    {
      id: 'dallas',
      name: 'Dallas Logistics',
      siteCode: 'DFW-04',
      city: 'Texas, USA',
      camerasTotal: 26,
      camerasOnline: 26,
      threatLevel: 'NORMAL',
      threatColor: 'text-[#016D5D] bg-[#E6F4F1] border-[#016D5D]/30',
      activeIncidents: 0,
      edgeLatency: '15.1ms',
      bandwidth: '110 Mbps',
    },
  ];

  // Filter findings based on selected site
  const filteredFindings = useMemo(() => {
    if (activeSiteFilter === 'all') return findings;
    if (activeSiteFilter === 'chennai') return findings.filter((f) => f.site.includes('Chennai'));
    if (activeSiteFilter === 'munich') return findings.filter((f) => f.site.includes('Munich'));
    if (activeSiteFilter === 'singapore') return findings.filter((f) => f.site.includes('Singapore'));
    if (activeSiteFilter === 'dallas') return findings.filter((f) => f.site.includes('Dallas'));
    return findings;
  }, [findings, activeSiteFilter]);

  const criticalFindings = useMemo(() => {
    return filteredFindings.filter((f) => f.severity === 'CRITICAL' || f.statusCategory === 'CRITICAL');
  }, [filteredFindings]);

  // Display top 3 critical / high-priority findings in 1x3 grid
  const topCriticalStream = useMemo(() => {
    const criticals = filteredFindings.filter((f) => f.severity === 'CRITICAL');
    if (criticals.length >= 3) return criticals.slice(0, 3);
    return filteredFindings.slice(0, 3);
  }, [filteredFindings]);

  // Telemetry Metric Cards with SVG Sparklines matching StatusCards
  const kpiCards = [
    {
      id: 'cameras',
      label: 'Edge Camera Fleet',
      caption: '100% Stream Uptime',
      subCaption: 'Zero edge frame drops',
      count: '142 / 142',
      unit: 'ONLINE',
      delta: '100% Active',
      isIncrease: true,
      colorTheme: {
        border: 'border-[#016D5D]/30',
        activeBorder: 'border-[#016D5D] ring-2 ring-[#016D5D]/20 bg-[#E6F4F1]',
        hoverBorder: 'hover:border-[#016D5D]/60 hover:bg-[#E6F4F1]/30',
        cardBg: 'bg-white',
        iconBg: 'bg-[#E6F4F1] text-[#016D5D] border border-[#016D5D]/25',
        textCount: 'text-neutral-900',
        textLabel: 'text-[#016D5D]',
        captionText: 'text-[#016D5D]/80',
        lineColor: '#016D5D',
        gradientStart: 'rgba(1, 109, 93, 0.22)',
        gradientEnd: 'rgba(230, 244, 241, 0.02)',
      },
      linePath: 'M 0 65 C 50 60, 100 48, 150 42 C 200 36, 250 24, 300 16 C 320 12, 335 10, 340 8 L 340 80 L 0 80 Z',
      strokePath: 'M 0 65 C 50 60, 100 48, 150 42 C 200 36, 250 24, 300 16 C 320 12, 335 10, 340 8',
      icon: Camera,
    },
    {
      id: 'precision',
      label: 'AI Model Precision',
      caption: 'Edge Inference Rate',
      subCaption: 'Verified by operators',
      count: '96.8%',
      unit: 'CONFIDENCE',
      delta: '+1.2% this week',
      isIncrease: true,
      colorTheme: {
        border: 'border-[#00E9C9]/40',
        activeBorder: 'border-[#016D5D] ring-2 ring-[#00E9C9]/30 bg-teal-50/50',
        hoverBorder: 'hover:border-[#016D5D]/60 hover:bg-teal-50/30',
        cardBg: 'bg-white',
        iconBg: 'bg-[#016D5D] text-[#00E9C9] border border-[#016D5D]',
        textCount: 'text-neutral-900',
        textLabel: 'text-[#016D5D]',
        captionText: 'text-neutral-600',
        lineColor: '#016D5D',
        gradientStart: 'rgba(0, 233, 201, 0.25)',
        gradientEnd: 'rgba(230, 244, 241, 0.02)',
      },
      linePath: 'M 0 55 C 50 50, 90 40, 140 42 C 190 32, 230 22, 280 18 C 300 15, 320 12, 340 10 L 340 80 L 0 80 Z',
      strokePath: 'M 0 55 C 50 50, 90 40, 140 42 C 190 32, 230 22, 280 18 C 300 15, 320 12, 340 10',
      icon: Cpu,
    },
    {
      id: 'automations',
      label: 'Automated Dispatch',
      caption: 'Mean Reaction Time',
      subCaption: '4 rules triggered today',
      count: '42s',
      unit: 'RESPONSE',
      delta: 'Target <60s',
      isIncrease: false,
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
      linePath: 'M 0 52 C 40 48, 70 32, 110 38 C 150 44, 180 20, 220 26 C 260 32, 300 15, 340 18 L 340 80 L 0 80 Z',
      strokePath: 'M 0 52 C 40 48, 70 32, 110 38 C 150 44, 180 20, 220 26 C 260 32, 300 15, 340 18',
      icon: Workflow,
    },
    {
      id: 'critical',
      label: 'Critical Threats',
      caption: 'Immediate Action',
      subCaption: 'Perimeter & safety breaches',
      count: String(criticalFindings.length),
      unit: 'ACTIVE',
      delta: `${criticalFindings.length} High Priority`,
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
      linePath: 'M 0 60 C 50 58, 90 42, 130 52 C 170 62, 200 18, 240 14 C 280 10, 310 30, 340 22 L 340 80 L 0 80 Z',
      strokePath: 'M 0 60 C 50 58, 90 42, 130 52 C 170 62, 200 18, 240 14 C 280 10, 310 30, 340 22',
      icon: AlertOctagon,
    },
  ];

  // Detector intelligence distribution
  const detectorStats = [
    { label: 'Crowd Density Limit', count: 14, percent: 96, category: 'Occupancy', icon: Users },
    { label: 'Perimeter / Vault Breach', count: 9, percent: 98, category: 'Security', icon: ShieldAlert },
    { label: 'Man Down & Worker Fall', count: 6, percent: 99, category: 'Safety', icon: Activity },
    { label: 'Unattended Object Theft', count: 5, percent: 95, category: 'Loss Prevention', icon: AlertTriangle },
    { label: 'Hazard & Thermal Spike', count: 3, percent: 92, category: 'Environmental', icon: Flame },
  ];

  return (
    <div className="space-y-4">
      {/* 
        STEP 1: OVERVIEW TITLE + SUBHEADING 
        With full-width line below text using primary color (#016D5D)
      */}
      <div className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#000000] font-sans">
              Overview
            </h1>
            <p className="text-xs text-neutral-600 mt-1 font-medium">
              Unified AI edge vision telemetry, cross-facility health metrics, and automated threat response.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E7EB] rounded-md shadow-2xs text-[11px] font-mono text-neutral-600">
              <span className="w-2 h-2 rounded-full bg-[#00E9C9] animate-pulse" />
              <span>142/142 Edge Feeds Active</span>
            </div>
            <button
              type="button"
              onClick={onNavigateToFindings}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#016D5D] hover:bg-[#01584b] rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Findings Feed</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {/* Full-width line below the text fully using NEVRIXA primary color #016D5D */}
        <div className="w-full h-[2px] bg-[#016D5D] mt-3.5" />
      </div>

      {/* 
        STEP 2: RETAINED AI SUGGEST BOX (NEVRIXA INTELLIGENCE)
        Global Operational Synthesis tailored for cross-facility overview
      */}
      <div className="bg-gradient-to-r from-[#016D5D]/8 via-[#00E9C9]/10 to-white border border-[#016D5D]/25 rounded-xl p-3.5 shadow-2xs relative transition-all">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#016D5D] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#00E9C9]" />
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#016D5D] uppercase">
                NEVRIXA INTELLIGENCE
              </span>
              <span className="text-neutral-300 text-xs">·</span>
              <span className="text-[10px] font-mono text-neutral-500 font-medium">
                Global Facility Synthesis
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-neutral-900 font-sans">
              &ldquo;All 142 edge camera streams synchronizing at 60 FPS. 3 critical incidents detected across Chennai and Munich facilities require immediate operator verification.&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 pt-0.5">
              <span className="flex items-center gap-1 font-medium text-red-800 bg-red-50/80 px-1.5 py-0.2 rounded border border-red-200">
                <AlertOctagon className="w-3 h-3 text-red-600 shrink-0" />
                3 critical alerts pending
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-[#016D5D] font-medium font-mono text-[11px]">14.2ms edge inference latency</span>
              <span className="text-neutral-300">·</span>
              <span className="text-neutral-700 font-medium font-mono text-[11px]">18 automated safety workflows armed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        STEP 3: STATUS / KPI METRIC CARDS WITH SPARKLINES
        Matching StatusCards styling with SVG trend curves and gradient fills
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpiCards.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedMetricCard === c.id;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedMetricCard(isSelected ? null : c.id)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border relative overflow-hidden transition-all duration-150 cursor-pointer select-none flex flex-col justify-between shadow-2xs group ${
                c.colorTheme.cardBg
              } ${
                isSelected
                  ? c.colorTheme.activeBorder
                  : `border-[#E5E7EB] ${c.colorTheme.hoverBorder}`
              }`}
            >
              {/* Background Sparkline & Gradient Area */}
              <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                <svg
                  viewBox="0 0 340 80"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id={`overview-grad-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.colorTheme.gradientStart} />
                      <stop offset="100%" stopColor={c.colorTheme.gradientEnd} />
                    </linearGradient>
                  </defs>
                  <path d={c.linePath} fill={`url(#overview-grad-${c.id})`} />
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

              {/* Card Header Content */}
              <div className="relative z-10 flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className={`text-xs font-bold uppercase tracking-wider font-mono block ${c.colorTheme.textLabel}`}>
                    {c.label}
                  </span>
                  <span className="text-[11px] text-neutral-500 block">
                    {c.caption}
                  </span>
                </div>

                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${c.colorTheme.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Big Numeric Metric & Delta */}
              <div className="relative z-10 mt-3 pt-1 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl font-bold font-mono tracking-tight ${c.colorTheme.textCount}`}>
                    {c.count}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    {c.unit}
                  </span>
                </div>

                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100/90 text-neutral-700 border border-neutral-200">
                  {c.delta}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 
        STEP 4: OPERATIONAL FILTER & FACILITY QUICK CONTROLS
        Cross-facility filter tabs and timeframe selectors
      */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Facility Site Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          <span className="text-[11px] font-mono font-semibold text-neutral-500 uppercase tracking-wider mr-1 shrink-0">
            Facilities:
          </span>
          {facilitySites.map((site) => {
            const isActive = activeSiteFilter === site.id;
            return (
              <button
                key={site.id}
                type="button"
                onClick={() => handleSiteChange(site.id)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E6F4F1] text-[#016D5D] font-bold border border-[#016D5D]/40 shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-transparent'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9]" />}
                <span>{site.name}</span>
                <span className="text-[10px] font-mono opacity-70">
                  ({site.id === 'all' ? '142' : site.camerasTotal})
                </span>
              </button>
            );
          })}
        </div>

        {/* Timeframe Selector & Total Count */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-md border border-[#E5E7EB]">
            {(['today', '7d', '30d'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setActiveTimeRange(period)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  activeTimeRange === period
                    ? 'bg-white text-neutral-900 font-bold shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {period === 'today' ? 'Today' : period === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onNavigateToFindings}
            className="text-[11px] font-semibold text-[#016D5D] hover:underline flex items-center gap-1"
          >
            <span>View All ({filteredFindings.length})</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 
        STEP 5A: MULTI-FACILITY STATUS MATRIX (HIGH-DENSITY ENTERPRISE TELEMETRY)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {facilitySites.filter((s) => s.id !== 'all').map((site) => {
          const isCurrentActive = activeSiteFilter === site.id;
          return (
            <div
              key={site.id}
              onClick={() => handleSiteChange(isCurrentActive ? 'all' : site.id)}
              className={`p-3.5 bg-white rounded-lg border transition-all cursor-pointer shadow-2xs select-none ${
                isCurrentActive
                  ? 'border-[#016D5D] ring-2 ring-[#016D5D]/20 bg-[#F9FBFA]'
                  : 'border-[#E5E7EB] hover:border-neutral-300 hover:bg-neutral-50/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E9C9] shrink-0" />
                    <h4 className="text-xs font-bold text-neutral-900 truncate">
                      {site.name}
                    </h4>
                  </div>
                  <span className="text-[10px] text-neutral-500 block mt-0.5 font-mono">
                    {site.siteCode} · {site.city}
                  </span>
                </div>

                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${site.threatColor}`}>
                  {site.threatLevel}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Cameras</span>
                  <span className="font-mono font-bold text-neutral-900 mt-0.5 block">
                    {site.camerasOnline}/{site.camerasTotal}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Incidents</span>
                  <span className={`font-mono font-bold mt-0.5 block ${site.activeIncidents > 0 ? 'text-red-600' : 'text-[#016D5D]'}`}>
                    {site.activeIncidents} active
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Latency</span>
                  <span className="font-mono font-medium text-neutral-700 mt-0.5 block">
                    {site.edgeLatency}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 
        STEP 5B: RECENT CRITICAL INCIDENTS (1 X 3 CAMERA CARD GRID WITH REAL CCTV PLAYERS)
        Following the exact 1x3 Grid layout and rich card details of the Finding page
      */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono tracking-wider text-neutral-900 uppercase">
              Live Priority Detections
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-xs font-mono text-red-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              {criticalFindings.length} Critical
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToFindings}
            className="text-xs font-semibold text-[#016D5D] hover:underline flex items-center gap-1"
          >
            <span>Open Findings Feed</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1 X 3 GRID OF RICH CAMERA CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topCriticalStream.map((finding) => {
            const isCritical = finding.severity === 'CRITICAL' || finding.statusCategory === 'CRITICAL';
            const severityBadgeClass = isCritical
              ? 'text-red-700 bg-red-50 border-red-300 font-bold'
              : 'text-amber-800 bg-amber-50 border-amber-300 font-semibold';

            return (
              <div
                key={finding.id}
                onClick={() => onSelectFinding(finding)}
                className="bg-white rounded-lg border border-[#E5E7EB] hover:border-[#016D5D] transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                {/* 1. CCTV Video Feed Viewport */}
                <div className="p-3 pb-0">
                  <div className="w-full aspect-video rounded-md overflow-hidden bg-neutral-950 relative border border-neutral-800 shadow-2xs">
                    <CCTVPlayer finding={finding} compact autoPlay={true} />

                    {/* Top Status Overlay Pill */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold text-white bg-black/75 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        REC · LIVE EDGE
                      </span>
                    </div>

                    {/* Bottom AI Overlay Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 pt-4 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9] shrink-0" />
                        <span className="text-[10px] font-semibold text-white truncate font-mono">
                          {finding.detectionLabel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#00E9C9] tabular-nums shrink-0 ml-2">
                        {finding.confidence.toFixed(1)}% match
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. High-Density Operational Data */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Header Row: Severity Pill, Monospaced ID & Location */}
                    <div className="flex items-center justify-between gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${severityBadgeClass}`}>
                          {finding.severity}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-neutral-800 bg-neutral-100 px-1.5 py-0.2 rounded">
                          {finding.id}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-neutral-500">
                        {finding.camera.id}
                      </span>
                    </div>

                    {/* Finding Title & Subtitle */}
                    <div className="mt-2">
                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#016D5D] transition-colors line-clamp-1">
                        {finding.title}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-1 mt-0.5">
                        {finding.subtitle}
                      </p>
                    </div>

                    {/* 4-Field Telemetry Matrix */}
                    <div className="mt-2.5 pt-2.5 border-t border-neutral-200 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-medium text-neutral-500 uppercase block leading-tight">Site</span>
                        <span className="text-xs font-semibold text-neutral-900 truncate block mt-0.5">
                          {finding.site}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-medium text-neutral-500 uppercase block leading-tight">Detected</span>
                        <span className="text-xs font-mono text-neutral-800 tabular-nums block mt-0.5">
                          {finding.timestamp}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-medium text-neutral-500 uppercase block leading-tight">Status</span>
                        <span className="text-[11px] font-mono font-semibold text-neutral-800 block mt-0.5">
                          {finding.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-medium text-neutral-500 uppercase block leading-tight">Confidence</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-mono font-bold text-[#016D5D] tabular-nums">
                            {finding.confidence.toFixed(1)}%
                          </span>
                          <div className="w-12 h-1.5 bg-neutral-200 rounded-full overflow-hidden shrink-0">
                            <div
                              className="h-full bg-[#016D5D] rounded-full"
                              style={{ width: `${finding.confidence}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Operational AI Synthesis */}
                    <div className="mt-2.5 p-2 rounded bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-700 leading-snug">
                      <span className="font-semibold text-neutral-900 font-mono text-[10px] uppercase block mb-0.5 text-[#016D5D]">
                        AI Perception Assessment:
                      </span>
                      <span className="line-clamp-2">
                        {finding.aiInterpretation}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Detail View Button */}
                  <div className="pt-2.5 border-t border-neutral-200 flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectFinding(finding)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#016D5D] hover:text-[#015246] bg-[#E6F4F1] hover:bg-[#8FF2E2]/50 border border-[#016D5D]/25 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs group/btn shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                      <span>Detail View</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        STEP 5C: OPERATIONAL ARCHITECTURE BANNER (3 PILLARS) & DETECTOR DISTRIBUTION
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
        {/* Left 2 Cols: Perception -> Understanding -> Action Architecture */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#016D5D]">
              <Sparkles className="w-3.5 h-3.5 text-[#00E9C9]" />
              NEVRIXA OPERATIONAL ARCHITECTURE
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mt-1">
              Perception → Understanding → Action
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5 max-w-xl">
              Real-time video edge inference translating multi-camera telemetry into verified operational insights and automated facility response.
            </p>

            {/* The 3 Pillars Graphic Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-neutral-100 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                  01 · PERCEPTION
                </span>
                <span className="font-semibold text-neutral-900 block mt-0.5">Edge Vision Backbone</span>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                  142 camera streams processed at 60 FPS with 14.2ms edge inference latency across 4 sites.
                </p>
              </div>

              <div className="p-3 bg-[#E6F4F1]/40 rounded-lg border border-[#016D5D]/20">
                <span className="text-[10px] font-mono font-bold text-[#016D5D] uppercase block">
                  02 · UNDERSTANDING
                </span>
                <span className="font-semibold text-neutral-900 block mt-0.5">Spatial & Context Fusion</span>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                  Fusing optical vector tracking with badge access logs, schedules, and restricted tripwire boundaries.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] font-mono font-bold text-neutral-800 uppercase block">
                  03 · ACTION
                </span>
                <span className="font-semibold text-neutral-900 block mt-0.5">Automated Workflows</span>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                  Instant physical door interlock lockouts, security radio dispatch, and automated evidence retention.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span className="font-mono text-[11px]">Edge Engine v4.2.1-prod · AES-256 Encrypted</span>
            <button
              type="button"
              onClick={onNavigateToFindings}
              className="text-[#016D5D] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Explore All Incidents</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: AI Detector Distribution & Health */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 uppercase font-mono tracking-wider">
                Detector Fleet Status
              </span>
              <span className="text-[10px] font-mono text-[#016D5D] bg-[#E6F4F1] px-1.5 py-0.5 rounded font-semibold">
                ALL ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Active neural detection models and confidence thresholds.
            </p>

            <div className="space-y-3 mt-4">
              {detectorStats.map((det) => {
                const Icon = det.icon;
                return (
                  <div key={det.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icon className="w-3.5 h-3.5 text-[#016D5D] shrink-0" />
                        <span className="font-medium text-neutral-800 truncate text-[11px]">{det.label}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-neutral-900">{det.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#016D5D] rounded-full transition-all"
                        style={{ width: `${det.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>5 Model Families</span>
            <span className="text-[#016D5D] font-semibold">96.8% Avg Precision</span>
          </div>
        </div>
      </div>
    </div>
  );
};
