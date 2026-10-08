import React, { useState } from 'react';
import {
  LayoutGrid,
  ShieldAlert,
  Radio,
  Bell,
  Camera,
  CheckSquare,
  Cpu,
  Workflow,
  History,
  BarChart2,
  Server,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedSite: string;
  onSelectSite: (site: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadAlertCount?: number;
  onSelectSubFinding?: (category: 'ALL' | 'CRITICAL' | 'ATTENTION' | 'INFORMATIONAL') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedSite,
  onSelectSite,
  collapsed,
  onToggleCollapse,
  unreadAlertCount = 4,
}) => {
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);

  const sites = [
    { id: 'all', name: 'Global Operations (All Site', count: '142 Cams' },
    { id: 'chennai', name: 'Chennai Facility', count: '48 Cams' },
    { id: 'munich', name: 'Munich Facility', count: '52 Cams' },
    { id: 'singapore', name: 'Singapore Hub', count: '42 Cams' },
  ];

  const activeSiteObj = sites.find((s) => s.id === selectedSite) || sites[0];

  const isItemActive = (id: string) => {
    if (id === 'finding') {
      return currentTab === 'finding' || currentTab === 'findings';
    }
    return currentTab === id;
  };

  const navOperations = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutGrid,
    },
    {
      id: 'finding',
      label: 'Finding',
      icon: ShieldAlert,
      badge: '8',
      badgeType: 'mint' as const,
    },
    {
      id: 'live-wall',
      label: 'Live Wall',
      icon: Radio,
      badgeType: 'dot' as const,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: String(unreadAlertCount || 4),
      badgeType: 'dark' as const,
    },
    {
      id: 'cameras',
      label: 'Cameras & Sites',
      icon: Camera,
    },
    {
      id: 'review',
      label: 'Review',
      icon: CheckSquare,
    },
  ];

  const navIntelligence = [
    {
      id: 'detectors',
      label: 'Detectors',
      icon: Cpu,
    },
    {
      id: 'automations',
      label: 'Automations',
      icon: Workflow,
    },
    {
      id: 'evidence',
      label: 'Evidence',
      icon: History,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart2,
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      icon: Server,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#FFFFFF] border-r border-[#E5E7EB] flex flex-col transition-all duration-200 select-none shadow-[4px_0_24px_rgba(0,0,0,0.08),1px_0_4px_rgba(0,0,0,0.04),8px_0_32px_rgba(1,109,93,0.06)] ${collapsed ? 'w-16' : 'w-[220px]'
        }`}
    >
      {/* 
        1. BRAND HEADER:
        - Open collapse: Attached Nevrixa-Logo-Full_Color with tagline "Intelligence wherever it matters" in primary color (#016D5D)
        - Close collapse: Attached SM_Logo-03 (no tagline)
        - Collapse arrow: Right side of sidenav box
      */}
      <div className={`relative border-b border-[#E5E7EB] flex items-center transition-all h-[72px] ${collapsed ? 'justify-center px-1' : 'py-2.5 px-3.5 justify-between'
        }`}>
        {!collapsed ? (
          <>
            <div
              className="flex flex-col cursor-pointer min-w-0 pr-2 group"
              onClick={() => onSelectTab('overview')}
              title="Nevrixa - Intelligence wherever it matters"
            >
              <img
                src="/nevrixa-logo-full.png"
                alt="Nevrixa"
                className="h-8 w-auto max-w-[170px] object-contain object-left group-hover:opacity-90 transition-opacity"
              />
              <span className="text-[11px] font-semibold text-[#016D5D] tracking-tight mt-1 leading-tight select-none whitespace-nowrap">
                Intelligence wherever it matters
              </span>
            </div>
            {/* Collapse arrow right side of sidenav box */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-[#E5E7EB] shadow-md flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all cursor-pointer z-50 hover:scale-110"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-neutral-700" />
            </button>
          </>
        ) : (
          <div className="relative flex items-center justify-center w-full">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center"
              title="Nevrixa (Expand sidebar)"
            >
              <img
                src="/sm-logo-03.png"
                alt="Nevrixa"
                className="w-9 h-9 object-contain"
              />
            </button>
            {/* Collapse arrow right side of sidenav box */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-[#E5E7EB] shadow-md flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all cursor-pointer z-50 hover:scale-110"
              title="Expand sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5 text-neutral-700" />
            </button>
          </div>
        )}
      </div>

      {/* 
        2. ACTIVE WORKSPACE:
        "Active Workspace" label with dropdown card containing green dot, title, count & chevron
      */}
      <div className="p-3 border-b border-[#E5E7EB] relative">
        {collapsed ? (
          <button
            type="button"
            onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
            className="w-10 h-10 mx-auto rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
            title={activeSiteObj.name}
          >
            <Building2 className="w-4 h-4 text-[#016D5D]" />
          </button>
        ) : (
          <div>
            <div className="text-xs font-medium text-neutral-500 mb-1.5">
              Active Workspace
            </div>
            <button
              type="button"
              onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-neutral-50/80 transition-colors text-left cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 truncate">
                    {activeSiteObj.name}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                    {activeSiteObj.count} · AI Active
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-700 shrink-0 ml-1 transition-transform ${siteDropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {siteDropdownOpen && (
              <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                {sites.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onSelectSite(s.id);
                      setSiteDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${selectedSite === s.id
                      ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-[10px] font-mono text-neutral-500 shrink-0 ml-2">
                      {s.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 
        3. NAVIGATION LIST:
        OPERATIONS & INTELLIGENCE & CONFIG
        Uses Active Workspace font-face, font-size (text-xs), font-weight (font-medium), and color (text-neutral-500)
        For collapse: a small border line is enough
      */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {/* Operations Header */}
        {!collapsed ? (
          <div className="text-xs font-medium text-neutral-500 px-3 pt-2.5 pb-1 select-none">
            Operation
          </div>
        ) : (
          <div className="border-t border-[#E5E7EB] mx-2.5 my-2" />
        )}

        {navOperations.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors group relative cursor-pointer ${active
                ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
            >
              {/* Active vertical pill indicator on the far left edge matching image */}
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 ${active
                  ? 'text-[#016D5D]'
                  : 'text-neutral-800 group-hover:text-neutral-900'
                  }`}
              />

              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>

                  {/* Mint badge (e.g. Finding "8") */}
                  {item.badgeType === 'mint' && item.badge && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#C7EFE8] text-[#016D5D]">
                      {item.badge}
                    </span>
                  )}

                  {/* Dot indicator (e.g. Live Wall teal dot) */}
                  {item.badgeType === 'dot' && (
                    <span className="w-2 h-2 rounded-full bg-[#00D4B2] shrink-0" />
                  )}

                  {/* Dark pill badge (e.g. Alerts "4") */}
                  {item.badgeType === 'dark' && item.badge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#111827] text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}

        {/* Intelligence & config Header */}
        {!collapsed ? (
          <div className="text-xs font-medium text-neutral-500 px-3 pt-3.5 pb-1 select-none">
            Intelligence & config
          </div>
        ) : (
          <div className="border-t border-[#E5E7EB] mx-2.5 my-2" />
        )}

        {navIntelligence.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors group relative cursor-pointer ${active
                ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 ${active
                  ? 'text-[#016D5D]'
                  : 'text-neutral-800 group-hover:text-neutral-900'
                  }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Area: Clean footer maintaining system health indicator & user profile */}
      <div className="p-3 border-t border-[#E5E7EB] bg-[#FFFFFF] space-y-2">
        {!collapsed ? (
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#016D5D] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                AK
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-neutral-900 truncate">
                  Arun Kumar
                </div>
                <div className="text-[10px] text-neutral-500 truncate">
                  SecOps Lead · Admin
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              title="Account Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-full bg-[#016D5D] text-white flex items-center justify-center text-[10px] font-semibold">
              AK
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
