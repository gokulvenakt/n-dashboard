import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Building2,
  Sparkles,
  Command,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  LayoutDashboard,
  SlidersHorizontal,
} from 'lucide-react';

interface TopCommandBarProps {
  currentTab: string;
  selectedSite: string;
  onOpenCommandPalette: (initialQuery?: string) => void;
  unreadCount?: number;
  onSelectSite?: (siteId: string) => void;
  overviewMode?: 'standard' | 'customize';
  onSetOverviewMode?: (mode: 'standard' | 'customize') => void;
  isCustomizing?: boolean;
  onToggleCustomizing?: () => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  currentTab,
  selectedSite,
  onOpenCommandPalette,
  unreadCount = 2,
  onSelectSite,
  overviewMode = 'standard',
  onSetOverviewMode,
  isCustomizing = false,
  onToggleCustomizing,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const sites = [
    { id: 'all', name: 'Global Operations (All Sites)', cameras: '15 / 15 Online' },
    { id: 'chennai', name: 'Chennai Facility', cameras: '8 Cams · CHN-01' },
    { id: 'munich', name: 'Munich Facility', cameras: '4 Cams · MUC-02' },
    { id: 'singapore', name: 'Singapore Hub', cameras: '3 Cams · SIN-03' },
  ];

  const currentSiteName = sites.find((s) => s.id === selectedSite)?.name || 'Global Operations';

  return (
    <header className="h-[72px] bg-white border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Breadcrumbs & Current Context */}
      <div className="flex items-center gap-2.5 text-xs min-w-0">

        <span className="text-neutral-600 font-semibold truncate text-sm">
          {currentTab === 'overview'
            ? 'Overview'
            : currentTab === 'finding' || currentTab === 'findings'
              ? 'Finding'
              : currentTab === 'live-wall'
                ? 'Live Wall'
                : currentTab === 'cameras'
                  ? 'Cameras & Sites'
                  : currentTab === 'review'
                    ? 'Review'
                    : currentTab.charAt(0).toUpperCase() + currentTab.slice(1).replace('-', ' ')}
        </span>
        <span className="text-neutral-300 hidden sm:inline">/</span>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F4F1] border border-[#016D5D]/20 text-[#016D5D] text-xs font-semibold">

          <span className="truncate max-w-[170px]">{currentSiteName}</span>
        </div>
      </div>

      {/* Right: Search Box, Live Health, Notifications, Help, Workspace & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Box in Header - Placed before bell icon */}
        <div className="relative flex items-center">
          <div
            onClick={() => onOpenCommandPalette()}
            className="flex items-center gap-2 h-7 px-3 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] hover:border-[#016D5D]/50 rounded-lg text-xs text-neutral-500 cursor-pointer transition-all shadow-2xs group w-34 sm:w-26 md:w-34"
            title="Search cameras, findings, sites, detectors..."
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#016D5D] transition-colors shrink-0" />
            <input
              type="text"
              readOnly
              placeholder="Search or jump to..."
              className="bg-transparent text-xs text-neutral-800 placeholder:text-neutral-400 outline-none w-full cursor-pointer font-sans"
            />

          </div>
        </div>

        {/* Live System Health Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F4F4F4] border border-[#E5E7EB] text-[11px] font-mono text-neutral-700">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>15/15 Cams Online</span>
        </div>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-[#F4F4F4] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#016D5D] rounded-full ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E5E7EB] rounded-lg shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] font-medium text-neutral-900">
                <span>Recent System Alerts</span>
                <span className="text-[10px] font-mono text-[#016D5D] bg-[#E6F4F1] px-1.5 py-0.5 rounded">
                  2 Critical
                </span>
              </div>
              <div className="divide-y divide-neutral-100 mt-1 max-h-60 overflow-y-auto">
                <div className="py-2">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span>2 Critical Findings Detected</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Server vault tripwire and crowd limit threshold exceeded.
                  </p>
                  <span className="text-[10px] font-mono text-neutral-400 mt-1 block">10:48 AM</span>
                </div>
                <div className="py-2">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Corridor Area Coverage Blindspot</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    No coverage recorded for 740h. Reconnect recommended.
                  </p>
                  <span className="text-[10px] font-mono text-neutral-400 mt-1 block">09:14 AM</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Docs */}
        <button
          type="button"
          onClick={() => onOpenCommandPalette('How does Nevrixa calculate confidence?')}
          className="p-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-[#F4F4F4] transition-colors cursor-pointer"
          title="AI Documentation & Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Standard & Customise Dashboard Mode Switcher */}
        <div className="flex items-center bg-[#F4F4F4] border border-[#E5E7EB] rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              if (onSetOverviewMode) onSetOverviewMode('standard');
              if (isCustomizing && onToggleCustomizing) onToggleCustomizing();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${overviewMode === 'standard' && !isCustomizing
              ? 'bg-white text-[#016D5D] shadow-xs font-bold border border-[#016D5D]/20'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            title="Standard View"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Standard</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (onSetOverviewMode) onSetOverviewMode('customize');
              if (onToggleCustomizing) onToggleCustomizing();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${overviewMode === 'customize' || isCustomizing
              ? 'bg-white text-[#016D5D] shadow-xs font-bold border border-[#016D5D]/20'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            title="Customise View"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customise</span>
          </button>
        </div>


      </div>
    </header>
  );
};
