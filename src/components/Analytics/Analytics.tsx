import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Flame,
  Award,
  Zap,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ClipAnalytics } from '../../types';

interface AnalyticsProps {
  analyticsData: ClipAnalytics[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ analyticsData }) => {
  const [selectedClipId, setSelectedClipId] = useState<string>(
    analyticsData[0]?.clipId || ''
  );

  const selectedClip =
    analyticsData.find((a) => a.clipId === selectedClipId) || analyticsData[0];

  // Aggregate totals
  const totalViews = analyticsData.reduce((acc, c) => acc + c.views, 0);
  const totalLikes = analyticsData.reduce((acc, c) => acc + c.likes, 0);
  const totalShares = analyticsData.reduce((acc, c) => acc + c.shares, 0);
  const totalSaves = analyticsData.reduce((acc, c) => acc + c.saves, 0);
  const avgRetention = (
    analyticsData.reduce((acc, c) => acc + c.retentionRate, 0) /
    (analyticsData.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 p-3.5 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-xl font-extrabold text-white">
              Painel de Desempenho & Analytics
            </h1>
          </div>
          <p className="text-xs text-zinc-400 hidden sm:block">
            Métricas em tempo real, curva de retenção de audiência e conversão dos cortes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
            ● Atualizado há 5 min
          </span>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Visualizações</span>
            <Eye className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {(totalViews / 1000).toFixed(1)}k
          </div>
          <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +32.8% vs semana passada
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Retenção Média</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{avgRetention}%</div>
          <p className="text-[10px] text-zinc-400 font-semibold">Acima da média geral (65%)</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Compartilhamentos</span>
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {(totalShares / 1000).toFixed(1)}k
          </div>
          <p className="text-[10px] text-indigo-400 font-semibold">Alta taxa viral orgânica</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Salvamentos</span>
            <Bookmark className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {(totalSaves / 1000).toFixed(1)}k
          </div>
          <p className="text-[10px] text-purple-400 font-semibold">Sinaliza conteúdo de valor</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Ganhos Estimados</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">R$ 3.680,00</div>
          <p className="text-[10px] text-zinc-400 font-semibold">Fundos de Criadores + Publis</p>
        </div>
      </div>

      {/* Retention Curve Deep Dive (Selected Clip) */}
      {selectedClip && (
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Análise Detalhada do Clipe
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                {selectedClip.clipTitle}
              </h3>
              <p className="text-xs text-zinc-400">
                Plataforma: <strong className="text-white uppercase">{selectedClip.platform}</strong> • Publicado: {selectedClip.publishedDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block">Virality Score</span>
                <span className="text-lg font-black text-rose-400">
                  {selectedClip.viralityScore}/100 🔥
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block">CTR no Perfil</span>
                <span className="text-lg font-black text-indigo-400">{selectedClip.ctr}%</span>
              </div>
            </div>
          </div>

          {/* Retention Curve Chart Visualizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Curva de Retenção Segundo a Segundo (Audiência Restante)
              </span>
              <span className="text-[11px] text-zinc-400">
                Gancho 0s-3s manteve <strong className="text-emerald-400">92%+</strong> dos usuários
              </span>
            </div>

            {/* Custom SVG Curve & Bars */}
            <div className="h-44 w-full bg-zinc-950 rounded-xl p-4 border border-zinc-850 flex items-end gap-2 relative overflow-hidden">
              {/* Reference Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                <div className="border-b border-zinc-700 w-full" />
                <div className="border-b border-zinc-700 w-full" />
                <div className="border-b border-zinc-700 w-full" />
              </div>

              {selectedClip.retentionCurve.map((point, idx) => {
                const heightPercent = point.percentage;
                return (
                  <div
                    key={point.second}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end z-10 group"
                  >
                    <span className="text-[9px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.percentage}%
                    </span>

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-500 group-hover:brightness-125 ${
                        idx === 0
                          ? 'bg-gradient-to-t from-rose-600 to-indigo-500'
                          : point.percentage >= 80
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                          : 'bg-gradient-to-t from-amber-600 to-yellow-500'
                      }`}
                    />

                    <span className="text-[9px] font-mono text-zinc-500">
                      {point.second}s
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
              <span>0s (Início do Gancho)</span>
              <span>15s (Desenvolvimento)</span>
              <span>30s+ (Call to Action / Final)</span>
            </div>
          </div>
        </div>
      )}

      {/* Clipes Compartilhados Table & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clips Performance Table (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-white">
            Histórico de Clipes & Métricas Individuais
          </h3>

          <div className="space-y-2.5">
            {analyticsData.map((clip) => {
              const isSelected = clip.clipId === selectedClipId;
              return (
                <div
                  key={clip.clipId}
                  onClick={() => setSelectedClipId(clip.clipId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-zinc-800 border-rose-500 ring-1 ring-rose-500/30 shadow-md'
                      : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 uppercase">
                        {clip.platform}
                      </span>
                      <span className="text-[10px] text-zinc-500">{clip.publishedDate}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {clip.clipTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Views</span>
                      <span className="font-bold text-white">
                        {(clip.views / 1000).toFixed(1)}k
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 block">Retenção</span>
                      <span className="font-bold text-emerald-400">{clip.retentionRate}%</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 block">Virality</span>
                      <span className="font-bold text-rose-400">{clip.viralityScore}</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Share Comparison */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-white">
            Distribuição por Rede Social
          </h3>

          <div className="space-y-4">
            {[
              { name: 'TikTok', percent: 54, views: '520k', color: 'bg-pink-500' },
              { name: 'YouTube Shorts', percent: 31, views: '298k', color: 'bg-red-500' },
              { name: 'Instagram Reels', percent: 15, views: '146k', color: 'bg-purple-500' },
            ].map((plat) => (
              <div key={plat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{plat.name}</span>
                  <span className="text-zinc-400">
                    {plat.views} ({plat.percent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${plat.percent}%` }}
                    className={`h-full ${plat.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <span className="font-bold text-rose-400 block">💡 Dica de Otimização:</span>
            <p>
              O TikTok apresentou a maior taxa de viralização orgânica nas primeiras 6 horas. Priorize postagens verticais de 30-45 segundos neste canal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
