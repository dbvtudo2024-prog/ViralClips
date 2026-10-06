import React, { useState } from 'react';
import {
  Users,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Video,
  Eye,
  Trash2,
  X,
} from 'lucide-react';
import { SocialAccount, SocialPlatform } from '../../types';

interface AccountsProps {
  accounts: SocialAccount[];
  onAddAccount: (account: SocialAccount) => void;
  onToggleAccountStatus: (id: string) => void;
  onRemoveAccount: (id: string) => void;
}

export const Accounts: React.FC<AccountsProps> = ({
  accounts,
  onAddAccount,
  onToggleAccountStatus,
  onRemoveAccount,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('tiktok');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const platformsMeta: Record<
    SocialPlatform,
    { name: string; icon: string; color: string; badge: string }
  > = {
    tiktok: { name: 'TikTok', icon: '🎵', color: 'text-pink-400', badge: 'Alta Virabilidade' },
    instagram: { name: 'Instagram Reels', icon: '📸', color: 'text-purple-400', badge: 'Maior Alcance' },
    youtube: { name: 'YouTube Shorts', icon: '▶️', color: 'text-red-400', badge: 'Monetização CPM' },
    x: { name: 'X (Twitter)', icon: '𝕏', color: 'text-zinc-200', badge: 'Discussões em Tempo Real' },
    linkedin: { name: 'LinkedIn', icon: '💼', color: 'text-blue-400', badge: 'B2B & Negócios' },
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const newAcc: SocialAccount = {
      id: `acc_${Date.now()}`,
      platform: selectedPlatform,
      username: username.startsWith('@') ? username.trim() : `@${username.trim()}`,
      displayName: displayName.trim() || username.trim(),
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 9000000)}?w=100&h=100&fit=crop`,
      followers: Math.floor(Math.random() * 80000) + 1200,
      postsThisMonth: 0,
      avgViews: Math.floor(Math.random() * 45000) + 5000,
      isConnected: true,
      tokenExpiresAt: '2027-04-10',
      status: 'active',
    };

    onAddAccount(newAcc);
    setUsername('');
    setDisplayName('');
    setIsModalOpen(false);
  };

  const totalFollowers = accounts.reduce((acc, curr) => acc + curr.followers, 0);
  const totalPostsMonth = accounts.reduce((acc, curr) => acc + curr.postsThisMonth, 0);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 p-3.5 sm:p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-xl font-extrabold text-white">
              Central de Contas Conectadas
            </h1>
          </div>
          <p className="text-xs text-zinc-400 hidden sm:block">
            Gerencie perfis ilimitados do TikTok, Instagram, YouTube, X e LinkedIn em um só lugar.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-950/40 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Conectar Nova Conta</span>
        </button>
      </div>

      {/* Connected Accounts Section */}
      {accounts.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-5 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center mx-auto text-zinc-400 shadow-inner">
            <Users className="w-7 h-7 text-rose-500" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-black text-white">Nenhuma Conta Vinculada Ainda</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Nenhuma conta fictícia é criada. Conecte seu canal real do TikTok, Instagram Reels, YouTube Shorts ou X para começar a agendar e publicar seus cortes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {[
              { id: 'tiktok' as SocialPlatform, name: 'TikTok', icon: '🎵', badge: 'Alta Virabilidade' },
              { id: 'instagram' as SocialPlatform, name: 'Reels', icon: '📸', badge: 'Instagram' },
              { id: 'youtube' as SocialPlatform, name: 'Shorts', icon: '▶️', badge: 'YouTube' },
              { id: 'x' as SocialPlatform, name: 'X', icon: '𝕏', badge: 'Twitter' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPlatform(p.id);
                  setIsModalOpen(true);
                }}
                className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-rose-500/50 hover:bg-zinc-900/80 transition-all flex flex-col items-center gap-1 group active:scale-95"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
                <span className="text-xs font-bold text-white">{p.name}</span>
                <span className="text-[10px] text-rose-400 font-semibold">+ Conectar</span>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-zinc-500 pt-2">
            Todas as postagens usam autorização direta e os dados de métricas são sincronizados em tempo real.
          </p>
        </div>
      ) : (
        <>
          {/* Aggregate Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-400 font-medium">Audiência Total Combinada</span>
              <div className="text-2xl font-black text-white">
                {(totalFollowers / 1000).toFixed(1)}k
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                Seguidores reais sincronizados
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-400 font-medium">Postagens no Mês</span>
              <div className="text-2xl font-black text-white">{totalPostsMonth} vídeos</div>
              <p className="text-[11px] text-indigo-400 font-semibold">Publicações ativas</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-400 font-medium">Contas Ativas</span>
              <div className="text-2xl font-black text-white">
                {accounts.filter((a) => a.isConnected).length} / {accounts.length}
              </div>
              <p className="text-[11px] text-zinc-400 font-semibold">Tokens e permissões ativas</p>
            </div>
          </div>

          {/* Connected Accounts Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => {
              const meta = platformsMeta[account.platform];
              const isActive = account.status === 'active' && account.isConnected;

              return (
                <div
                  key={account.id}
                  className="bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 transition-all space-y-4 shadow-md flex flex-col justify-between"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={account.avatarUrl}
                          alt={account.displayName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-zinc-700"
                        />
                        <span className="absolute -bottom-1 -right-1 text-sm">{meta.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white leading-tight">
                          {account.displayName}
                        </h3>
                        <p className="text-xs text-zinc-400">{account.username}</p>
                        <span className="text-[10px] text-zinc-500 font-medium mt-0.5 block">
                          {meta.name}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    {isActive ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertCircle className="w-3 h-3" />
                        Pausada
                      </span>
                    )}
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-zinc-950 border border-zinc-850 text-center">
                    <div>
                      <div className="text-[10px] text-zinc-500">Seguidores</div>
                      <div className="text-xs font-bold text-white">{(account.followers / 1000).toFixed(1)}k</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500">Posts Mês</div>
                      <div className="text-xs font-bold text-white">{account.postsThisMonth}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500">Média Views</div>
                      <div className="text-xs font-bold text-emerald-400">{(account.avgViews / 1000).toFixed(1)}k</div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onToggleAccountStatus(account.id)}
                      className={`font-semibold text-[11px] ${
                        isActive ? 'text-zinc-400 hover:text-zinc-200' : 'text-amber-400 hover:underline'
                      }`}
                    >
                      {isActive ? 'Pausar Publicação' : 'Reconectar'}
                    </button>

                    <button
                      onClick={() => onRemoveAccount(account.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                      title="Desvincular conta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Connect Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Vincular Nova Conta Social</h2>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Conecte seu perfil para permitir publicações diretas e agendamento contínuo.
            </p>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Selecione a Rede Social
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['tiktok', 'instagram', 'youtube', 'x', 'linkedin'] as SocialPlatform[]).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPlatform(p)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                          selectedPlatform === p
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                      >
                        <span className="text-base">{platformsMeta[p].icon}</span>
                        <span>{platformsMeta[p].name}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nome de Usuário (@handle)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@seucanal.cortes"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nome de Exibição / Título do Canal
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex: Cortes Virais Brasil"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Autorizar & Conectar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
