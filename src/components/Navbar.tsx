import React from 'react';
import {
  Scissors,
  Users,
  Flame,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAccountsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeAccountsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => setActiveTab('autopilot')}
          className="flex items-center gap-2 text-left group"
        >
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-indigo-600 flex items-center justify-center shadow-md shadow-rose-950/40 shrink-0 group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                ViralClip<span className="text-rose-500">.Studio</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                PRO IA
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden lg:block leading-none mt-0.5">
              Caçador de Vídeos Virais & Auto-Clipper
            </p>
          </div>
        </button>
      </div>

      {/* Right side actions - Clean & spacious on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {activeAccountsCount > 0 ? (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{activeAccountsCount} contas</span>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab('accounts')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs transition-colors"
          >
            <span>+ Conectar Contas</span>
          </button>
        )}

        {/* Piloto Automático Button */}
        <button
          onClick={() => setActiveTab('autopilot')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm ${
            activeTab === 'autopilot'
              ? 'bg-rose-600 text-white shadow-rose-950/40 ring-1 ring-rose-400'
              : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
          }`}
          title="Automação 1-Clique: Buscar, Cortar e Postar"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Auto ⚡</span>
        </button>

        {/* Connected Accounts Icon */}
        <button
          onClick={() => setActiveTab('accounts')}
          className={`p-1.5 sm:p-2 rounded-lg border transition-colors relative ${
            activeTab === 'accounts'
              ? 'bg-zinc-800 border-zinc-600 text-white'
              : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Central de Contas Conectadas"
        >
          <Users className="w-4 h-4" />
          {activeAccountsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-zinc-950" />
          )}
        </button>

        {/* Criar Clipe (Desktop Only to save mobile space) */}
        <button
          onClick={() => setActiveTab('studio')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-semibold transition-all border border-zinc-700/80 active:scale-95"
        >
          <Scissors className="w-3.5 h-3.5 text-rose-400" />
          <span>Estúdio</span>
        </button>
      </div>
    </header>
  );
};
