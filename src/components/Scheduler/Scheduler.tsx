import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Trash2,
  Plus,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
} from 'lucide-react';
import { ScheduledPost, SocialAccount, VideoClip } from '../../types';

interface SchedulerProps {
  scheduledPosts: ScheduledPost[];
  accounts: SocialAccount[];
  onPublishNow: (post: ScheduledPost) => void;
  onDeletePost: (postId: string) => void;
  onOpenScheduleModal: () => void;
}

export const Scheduler: React.FC<SchedulerProps> = ({
  scheduledPosts,
  accounts,
  onPublishNow,
  onDeletePost,
  onOpenScheduleModal,
}) => {
  const [viewMode, setViewMode] = useState<'queue' | 'calendar'>('queue');
  const [statusFilter, setStatusFilter] = useState<'all' | 'agendado' | 'publicado'>('all');

  const filteredPosts = scheduledPosts.filter((post) => {
    if (statusFilter === 'all') return true;
    return post.status === statusFilter;
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return '🎵 TikTok';
      case 'instagram':
        return '📸 Reels';
      case 'youtube':
        return '▶️ Shorts';
      case 'x':
        return '𝕏 X';
      case 'linkedin':
        return '💼 LinkedIn';
      default:
        return platform;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 p-3.5 sm:p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-xl font-extrabold text-white">
              Painel de Agendamento Inteligente
            </h1>
          </div>
          <p className="text-xs text-zinc-400 hidden sm:block">
            Automatize suas postagens em múltiplos canais simultâneos nos melhores horários de retenção.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScheduleModal}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-950/40 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar Novo Clipe</span>
          </button>
        </div>
      </div>

      {/* Control bar: View Switcher & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-zinc-900/40 border border-zinc-800/80 p-2 rounded-xl">
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80">
          <button
            onClick={() => setViewMode('queue')}
            className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all text-center ${
              viewMode === 'queue' ? 'bg-zinc-850 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Fila ({filteredPosts.length})
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all text-center ${
              viewMode === 'calendar' ? 'bg-zinc-850 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Calendário
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <span className="text-zinc-500 text-[11px]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
          >
            <option value="all">Todos ({scheduledPosts.length})</option>
            <option value="agendado">Agendados</option>
            <option value="publicado">Publicados</option>
          </select>
        </div>
      </div>

      {/* QUEUE VIEW */}
      {viewMode === 'queue' && (
        <div className="space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl space-y-3">
              <CalendarIcon className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-zinc-400 text-sm font-medium">
                Nenhum post agendado encontrado para este filtro.
              </p>
              <button
                onClick={onOpenScheduleModal}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
              >
                Criar primeiro agendamento
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const dateObj = new Date(post.scheduledTime);
              const formattedDate = dateObj.toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
              });
              const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              });

              const isPublished = post.status === 'publicado';

              return (
                <div
                  key={post.id}
                  className="bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-md"
                >
                  {/* Left: Thumbnail & Content */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-24 rounded-xl bg-zinc-950 overflow-hidden relative shrink-0 border border-zinc-800">
                      <img
                        src={post.clipThumbnail}
                        alt={post.clipTitle}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1 bg-black/80 rounded text-[9px] font-mono text-white">
                        9:16
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isPublished ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Publicado com Sucesso
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            Agendado
                          </span>
                        )}

                        <span className="text-xs font-bold text-white bg-zinc-950 px-2.5 py-0.5 rounded-lg border border-zinc-800">
                          {formattedDate} às {formattedTime}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">
                        {post.clipTitle}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-2 max-w-xl">
                        {post.caption}
                      </p>

                      {/* Platforms badges */}
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        {post.platforms.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 font-medium"
                          >
                            {getPlatformIcon(p)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {!isPublished && (
                      <button
                        onClick={() => onPublishNow(post)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
                        title="Publicar neste momento"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-300" />
                        <span>Publicar Agora</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-900 transition-colors"
                      title="Excluir post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-rose-500" />
              <span>Semana de Distribuição de Conteúdo</span>
            </h3>
            <span className="text-xs text-zinc-400">Outubro 2026</span>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, idx) => {
              const dayPosts = scheduledPosts.filter((_, i) => i % 7 === idx);
              return (
                <div
                  key={day}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 min-h-[140px] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2">
                    <span>{day}</span>
                    <span className="text-[11px] text-zinc-500">{idx + 6} Out</span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    {dayPosts.map((p) => (
                      <div
                        key={p.id}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200 line-clamp-2 hover:border-rose-500 transition-colors"
                      >
                        <div className="text-[9px] font-bold text-rose-400">18:30</div>
                        <div className="truncate font-semibold">{p.clipTitle}</div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={onOpenScheduleModal}
                    className="mt-2 w-full py-1 text-[10px] font-semibold text-zinc-500 hover:text-white rounded bg-zinc-900/60 hover:bg-zinc-800 transition-colors text-center"
                  >
                    + Horário
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
