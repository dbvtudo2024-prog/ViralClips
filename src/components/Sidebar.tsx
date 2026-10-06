import React, { useState } from 'react';
import {
  Compass,
  Scissors,
  Calendar,
  BarChart3,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingClipsCount?: number;
  scheduledCount?: number;
}

export const Sidebar: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingClipsCount = 3,
  scheduledCount = 2,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavGroups = [
    {
      group: 'Automação Viral',
      items: [
        {
          id: 'autopilot',
          label: 'Piloto Automático',
          icon: Zap,
          badge: '1-Clique',
          badgeVariant: 'gradient',
          description: 'Busca, corta e posta no pico',
        },
      ],
    },
    {
      group: 'Produção',
      items: [
        {
          id: 'search',
          label: 'Radar de Virais',
          icon: Compass,
          badge: 'YouTube',
          badgeVariant: 'neutral',
        },
        {
          id: 'studio',
          label: 'Estúdio de Cortes',
          icon: Scissors,
          badge: pendingClipsCount > 0 ? `${pendingClipsCount}` : undefined,
          badgeVariant: 'neutral',
        },
      ],
    },
    {
      group: 'Distribuição & Dados',
      items: [
        {
          id: 'scheduler',
          label: 'Agenda & Horários',
          icon: Calendar,
          badge: scheduledCount > 0 ? `${scheduledCount}` : undefined,
          badgeVariant: 'neutral',
        },
        {
          id: 'analytics',
          label: 'Métricas & Retenção',
          icon: BarChart3,
        },
        {
          id: 'accounts',
          label: 'Minhas Contas',
          icon: Users,
        },
      ],
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-zinc-800/70 bg-zinc-950/95 backdrop-blur-xl shrink-0 h-[calc(100vh-57px)] sticky top-[57px] justify-between transition-all duration-300 select-none z-30 ${
        isCollapsed ? 'w-[68px] p-2.5' : 'w-64 p-3.5'
      }`}
    >
      {/* Top Header & Navigation Links */}
      <div className="space-y-4">
        {/* Workspace Brand / Collapse Trigger */}
        <div className="flex items-center justify-between px-2 pt-0.5 pb-2.5 border-b border-zinc-800/80">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Studio Pro
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          {mainNavGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!isCollapsed && (
                <div className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {group.group}
                </div>
              )}

              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isSpecial = item.id === 'autopilot';

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center rounded-xl text-left transition-all duration-150 relative group ${
                        isCollapsed
                          ? 'justify-center p-2.5 my-1'
                          : 'justify-between px-3 py-2.5 text-xs font-medium'
                      } ${
                        isActive
                          ? isSpecial
                            ? 'bg-rose-500/15 text-rose-200 font-bold ring-1 ring-rose-500/40 shadow-sm'
                            : 'bg-zinc-900 text-white font-semibold ring-1 ring-zinc-700/80 shadow-xs'
                          : isSpecial
                          ? 'text-rose-300 hover:bg-rose-500/10 hover:text-white'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span
                          className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${
                            isSpecial ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]' : 'bg-zinc-300'
                          }`}
                        />
                      )}

                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? isSpecial
                                ? 'text-rose-400 fill-rose-400/30'
                                : 'text-white'
                              : isSpecial
                              ? 'text-rose-400'
                              : 'text-zinc-400 group-hover:text-zinc-200'
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="truncate tracking-tight font-medium">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {/* Clean Badge Pill */}
                      {!isCollapsed && item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 transition-all ${
                            item.badgeVariant === 'gradient'
                              ? 'bg-gradient-to-r from-rose-500/20 to-indigo-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-zinc-850 text-zinc-400 border border-zinc-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip on Collapsed Mode */}
                      {isCollapsed && (
                        <span className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Footer Card */}
      <div className="pt-2 border-t border-zinc-800/80">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <div className="text-[11px] leading-tight">
                <div className="font-semibold text-zinc-200">Algoritmo Ativo</div>
                <div className="text-[10px] text-zinc-500">Picos 12h • 18h • 21h</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-bold border border-zinc-700/60">
              9:16
            </span>
          </div>
        ) : (
          <div className="flex justify-center py-1" title="Algoritmo de Picos Ativo">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export const MobileBottomNav: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingClipsCount = 3,
}) => {
  const tabs = [
    { id: 'autopilot', label: 'Auto', icon: Zap, isSpecial: true },
    { id: 'search', label: 'Radar', icon: Compass },
    { id: 'studio', label: 'Cortes', icon: Scissors, badge: pendingClipsCount },
    { id: 'scheduler', label: 'Agenda', icon: Calendar },
    { id: 'analytics', label: 'Métricas', icon: BarChart3 },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-1.5 py-1 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isSpecial = tab.isSpecial;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl relative transition-all active:scale-95 ${
                isActive
                  ? isSpecial
                    ? 'text-rose-400 font-bold'
                    : 'text-white font-bold'
                  : isSpecial
                  ? 'text-rose-400/80'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4.5 h-4.5 transition-transform ${
                    isActive ? (isSpecial ? 'scale-110 text-rose-400 fill-rose-400/30' : 'scale-110 text-white') : ''
                  }`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-bold bg-rose-600 text-white rounded-full shadow-sm leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-white' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

