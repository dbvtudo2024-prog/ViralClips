import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  Plus,
  Play,
  Scissors,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Youtube,
  Zap,
} from 'lucide-react';
import { ViralVideo, CustomCategory } from '../../types';
import { NewCategoryModal } from './NewCategoryModal';

interface VideoSearchProps {
  videos: ViralVideo[];
  categories: CustomCategory[];
  onAddCategory: (category: CustomCategory) => void;
  onSelectVideoForClipping: (video: ViralVideo) => void;
  onImportCustomUrl: (url: string) => void;
}

export const VideoSearch: React.FC<VideoSearchProps> = ({
  videos,
  categories,
  onAddCategory,
  onSelectVideoForClipping,
  onImportCustomUrl,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('cat_all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [sortBy, setSortBy] = useState<'velocity' | 'score' | 'views'>('velocity');
  const [minScore, setMinScore] = useState<number>(80);
  const [previewVideo, setPreviewVideo] = useState<ViralVideo | null>(null);

  // Filtered and sorted videos
  const filteredVideos = useMemo(() => {
    return videos
      .filter((video) => {
        // Category filter
        if (selectedCategory !== 'cat_all' && video.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = video.title.toLowerCase().includes(q);
          const matchChannel = video.channelTitle.toLowerCase().includes(q);
          const matchTags = video.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchChannel && !matchTags) return false;
        }

        // Min virality score
        if (video.viralityScore < minScore) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'velocity') return b.viewsPerHour - a.viewsPerHour;
        if (sortBy === 'score') return b.viralityScore - a.viralityScore;
        return b.views - a.views;
      });
  }, [videos, selectedCategory, searchQuery, minScore, sortBy]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onImportCustomUrl(customUrl.trim());
    setCustomUrl('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-8">
      {/* Hero / Quick URL Extraction Banner - Compact and breathable on mobile */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-rose-950/30 border border-zinc-800/80 p-3.5 sm:p-5 shadow-lg">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>Radar YouTube Viral</span>
            </div>
            <h1 className="text-base sm:text-xl font-black text-white tracking-tight leading-tight">
              Caçador de Vídeos com Picos de Retenção
            </h1>
            <p className="hidden sm:block text-xs text-zinc-400">
              Cole qualquer link do YouTube ou explore vídeos com alta velocidade de views por hora.
            </p>
          </div>

          {/* Quick Paste Form */}
          <form
            onSubmit={handleUrlSubmit}
            className="flex items-center gap-2 w-full md:w-auto md:min-w-[380px]"
          >
            <div className="relative flex-1">
              <Youtube className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Cole o link do YouTube..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs sm:text-sm focus:outline-none focus:border-rose-500 placeholder:text-zinc-500 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-rose-950/40 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analisar</span>
            </button>
          </form>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scrollbar-none py-0.5 touch-scroll w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? 'bg-zinc-850 text-white border-zinc-700 shadow-xs'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-850 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}

            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova</span>
            </button>
          </div>
        </div>

        {/* Search Input & Sorting Controls - Compact */}
        <div className="flex items-center justify-between gap-2 bg-zinc-900/60 border border-zinc-850 p-1.5 sm:p-2 rounded-xl">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, canal ou nicho..."
              className="w-full pl-8 pr-2 py-1 sm:py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-rose-500 placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
            >
              <option value="velocity">🔥 Views/h</option>
              <option value="score">⚡ Score</option>
              <option value="views">👁️ Total</option>
            </select>

            <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
              <span className="text-[11px]">Min:</span>
              <span className="text-rose-400 font-bold text-xs">{minScore}</span>
              <input
                type="range"
                min="70"
                max="95"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-16 accent-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Results Count */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
        <span>
          Exibindo <strong className="text-white">{filteredVideos.length}</strong> vídeos com alto potencial de viralização
        </span>
        <span className="hidden sm:flex items-center gap-1 text-amber-400 font-medium">
          <Zap className="w-3 h-3" />
          Rastreamento de picos ativo
        </span>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5">
        {filteredVideos.map((video) => {
          const categoryObj = categories.find((c) => c.id === video.category);
          return (
            <div
              key={video.id}
              className="group flex flex-col bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/20"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold text-white">
                  {video.duration}
                </span>

                {/* Virality Score Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-300 text-xs font-black shadow-lg">
                  <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>{video.viralityScore}/100</span>
                </div>

                {/* Views Per Hour Velocity */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-zinc-700 text-amber-400 text-[11px] font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{(video.viewsPerHour / 1000).toFixed(1)}k/h</span>
                </div>

                {/* Quick Play Overlay */}
                <button
                  onClick={() => setPreviewVideo(video)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </button>
              </div>

              {/* Content Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Category & Published time */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className="px-2 py-0.5 rounded-md font-medium"
                      style={{
                        backgroundColor: `${categoryObj?.color || '#6366f1'}20`,
                        color: categoryObj?.color || '#818cf8',
                      }}
                    >
                      {categoryObj?.name || 'Geral'}
                    </span>
                    <span className="text-zinc-500">{video.publishedAt}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2 leading-snug group-hover:text-rose-300 transition-colors">
                    {video.title}
                  </h3>

                  {/* Channel info */}
                  <div className="flex items-center gap-2 pt-1">
                    <img
                      src={video.channelAvatar}
                      alt={video.channelTitle}
                      className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                    />
                    <span className="text-xs text-zinc-400 truncate font-medium">
                      {video.channelTitle}
                    </span>
                  </div>

                  {/* Stats summary */}
                  <div className="flex items-center gap-3 pt-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-zinc-500" />
                      {(video.views / 1000000).toFixed(1)}M views
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      {video.potentialClipsCount} clipes detectados
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onSelectVideoForClipping(video)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/40 transition-all active:scale-98"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Gerar Cortes com IA</span>
                  </button>

                  <button
                    onClick={() => setPreviewVideo(video)}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Assistir Vídeo Original"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Category Modal */}
      <NewCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={onAddCategory}
      />

      {/* YouTube Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md">
                  {previewVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-zinc-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg bg-zinc-800"
              >
                Fechar
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${previewVideo.youtubeId}?autoplay=1`}
                title={previewVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 flex items-center justify-between bg-zinc-950">
              <div className="text-xs text-zinc-400">
                Score Viral: <strong className="text-rose-400">{previewVideo.viralityScore}/100</strong> • Velocidade: <strong className="text-amber-400">+{previewVideo.viewsPerHour.toLocaleString()} views/h</strong>
              </div>
              <button
                onClick={() => {
                  const v = previewVideo;
                  setPreviewVideo(null);
                  onSelectVideoForClipping(v);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                <Scissors className="w-4 h-4" />
                <span>Cortar este Vídeo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
