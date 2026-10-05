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
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#FFFFFF] border-r border-[#E5E7EB] flex flex-col transition-all duration-200 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 
        1. BRAND HEADER:
        Follows image strictly: "Nevrixa" text in teal with "<" collapse chevron on the right
      */}
      <div className={`h-14 border-b border-[#E5E7EB] flex items-center ${collapsed ? 'justify-center px-1' : 'justify-between px-4'}`}>
        {!collapsed ? (
          <>
            <span
              onClick={() => onSelectTab('overview')}
              className="text-[#016D5D] font-bold text-xl tracking-tight font-sans cursor-pointer hover:opacity-90 transition-opacity"
            >
              Nevrixa
            </span>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-9 h-9 rounded-lg bg-[#E6F4F1] text-[#016D5D] flex items-center justify-center font-bold text-base hover:bg-[#d8efe9] transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            N
          </button>
        )}
      </div>

      {/* Expand button below header when collapsed */}
      {collapsed && (
        <div className="py-2 flex justify-center border-b border-[#E5E7EB]">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-neutral-500 hover:text-[#016D5D] hover:bg-[#E6F4F1] transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

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
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D4B2] shrink-0" />
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
                className={`w-4 h-4 text-neutral-700 shrink-0 ml-1 transition-transform ${
                  siteDropdownOpen ? 'rotate-180' : ''
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
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedSite === s.id
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
        Strictly follows ordinal order from attached image:
        OPERATIONS:
          1. Overview
          2. Finding
          3. Live Wall
          4. Alerts
          5. Cameras & Sites
          6. Review
        INTELLIGENCE & CONFIG:
          7. Detectors
          8. Automations
          9. Evidence
          10. Reports
          11. Infrastructure
          12. Settings
      */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {/* OPERATIONS Header */}
        {!collapsed ? (
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 pt-2 pb-1">
            OPERATIONS
          </div>
        ) : (
          <div className="h-2" />
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors group relative cursor-pointer ${
                active
                  ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              {/* Active vertical pill indicator on the far left edge matching image */}
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 ${
                  active
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

        {/* INTELLIGENCE & CONFIG Header */}
        {!collapsed ? (
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 pt-4 pb-1">
            INTELLIGENCE & CONFIG
          </div>
        ) : (
          <div className="h-4 border-t border-neutral-100 my-2" />
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors group relative cursor-pointer ${
                active
                  ? 'bg-[#E6F4F1] text-[#016D5D] font-semibold'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#016D5D] rounded-r" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 ${
                  active
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
