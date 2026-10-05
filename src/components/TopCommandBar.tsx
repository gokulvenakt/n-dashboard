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
} from 'lucide-react';

interface TopCommandBarProps {
  currentTab: string;
  selectedSite: string;
  onOpenCommandPalette: (initialQuery?: string) => void;
  unreadCount?: number;
  onSelectSite?: (siteId: string) => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  currentTab,
  selectedSite,
  onOpenCommandPalette,
  unreadCount = 2,
  onSelectSite,
}) => {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const sites = [
    { id: 'all', name: 'Global Operations (All Sites)', cameras: '15 / 15 Online' },
    { id: 'chennai', name: 'Chennai Facility', cameras: '8 Cams · CHN-01' },
    { id: 'munich', name: 'Munich Facility', cameras: '4 Cams · MUC-02' },
    { id: 'singapore', name: 'Singapore Hub', cameras: '3 Cams · SIN-03' },
  ];

  const currentSiteName = sites.find((s) => s.id === selectedSite)?.name || 'Global Operations';

  return (
    <header className="h-14 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Breadcrumbs & Current Context */}
      <div className="flex items-center gap-2 text-xs min-w-0">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-900 shrink-0">
          <span>NEVRIXA</span>
          <span className="text-neutral-300">/</span>
        </div>
        <span className="text-neutral-500 font-medium truncate">
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
        <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F4F1] border border-[#016D5D]/20 text-[#016D5D] text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9]" />
          <span className="truncate max-w-[140px]">{currentSiteName}</span>
        </div>
      </div>



      {/* Right: Notifications, Help, Workspace & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live System Health Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F4F4F4] border border-[#E5E7EB] text-[11px] font-mono text-neutral-700">
          <span className="w-2 h-2 rounded-full bg-[#00E9C9] animate-pulse" />
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

        {/* Workspace Switcher */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-neutral-700 hover:bg-[#F4F4F4] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#016D5D]" />
            <span className="max-w-[110px] truncate">Operations</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E5E7EB] rounded-lg shadow-xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-mono text-neutral-400 uppercase">
                Select Workspace Site
              </div>
              {sites.map((site) => (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => {
                    if (onSelectSite) onSelectSite(site.id);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F4F4F4] cursor-pointer ${selectedSite === site.id ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold' : 'text-neutral-700'
                    }`}
                >
                  <span className="truncate">{site.name}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{site.cameras}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#E5E7EB]">
          <div className="w-7 h-7 rounded-full bg-[#016D5D] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
            AK
          </div>
        </div>
      </div>
    </header>
  );
};
