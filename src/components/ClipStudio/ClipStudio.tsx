import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Scissors,
  Share2,
  Calendar,
  Download,
  Languages,
  Sparkles,
  Type,
  Sliders,
  Flame,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Bookmark,
  Smartphone,
  Layers,
  Copy,
  Check,
  Zap,
  Edit3,
  RefreshCw,
  Clock,
  ArrowRight,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import {
  VideoClip,
  SubtitleStyle,
  SubtitleLanguage,
  SubtitleSegment,
  ViralVideo,
} from '../../types';
import { geminiService } from '../../services/geminiService';

interface ClipStudioProps {
  currentClip: VideoClip;
  allClips: VideoClip[];
  onSelectClip: (clip: VideoClip) => void;
  onUpdateClip: (updatedClip: VideoClip) => void;
  onQuickShare: (clip: VideoClip) => void;
  onScheduleClip: (clip: VideoClip) => void;
  sourceVideo?: ViralVideo;
}

const LANGUAGES: Array<{ code: SubtitleLanguage; name: string; flag: string }> = [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語 (Japonês)', flag: '🇯🇵' },
];

const SUBTITLE_STYLES: Array<{ id: SubtitleStyle; name: string; preview: string; description: string }> = [
  { id: 'hormozi', name: 'Hormozi / MrBeast', preview: 'TEXTO AMARELO COM DESTAQUE VERDE', description: 'Alta conversão e retenção máxima' },
  { id: 'neon', name: 'Cyber Neon', preview: 'GLOW CIANO E ROXO PULSANTE', description: 'Visual moderno tech & games' },
  { id: 'karaoke', name: 'Karaokê Dinâmico', preview: 'PALAVRAS ACENDEM EM TEMPO REAL', description: 'Sincronia perfeita palavra por palavra' },
  { id: 'minimal', name: 'Minimalista Clean', preview: 'Fundo preto translúcido elegante', description: 'Ideal para negócios e educação' },
  { id: 'comic', name: 'Comic Boom', preview: 'FONTE CARTOON COM BORDA FORTE', description: 'Ideal para humor e entretenimento' },
];

export const ClipStudio: React.FC<ClipStudioProps> = ({
  currentClip,
  allClips,
  onSelectClip,
  onUpdateClip,
  onQuickShare,
  onScheduleClip,
  sourceVideo,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'subtitles' | 'trim' | 'copy'>('subtitles');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(48200);
  const [isLiked, setIsLiked] = useState(false);
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [playerMode, setPlayerMode] = useState<'preview' | 'youtube'>('preview');

  const duration = Math.max(1, currentClip.endSecond - currentClip.startSecond);

  // Playback timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0; // Loop playback
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Current active subtitle segment based on playback time
  const activeSubtitle = currentClip.subtitles.find(
    (seg) => currentTime >= seg.start && currentTime <= seg.end
  );

  const handleSeek = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, time)));
  };

  const handleLanguageChange = async (newLang: SubtitleLanguage) => {
    if (newLang === currentClip.language) return;
    setIsTranslating(true);
    try {
      const fullText = currentClip.subtitles.map((s) => s.text).join(' ');
      const result = await geminiService.generateCaptions({
        text: fullText,
        targetLanguage: newLang,
        durationSeconds: duration,
      });

      onUpdateClip({
        ...currentClip,
        language: newLang,
        subtitles: result.segments,
      });
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleUpdateSubtitleText = (id: string, newText: string, newWord?: string, emoji?: string) => {
    const updated = currentClip.subtitles.map((s) =>
      s.id === id
        ? {
            ...s,
            text: newText.toUpperCase(),
            highlightWord: newWord !== undefined ? newWord : s.highlightWord,
            emoji: emoji !== undefined ? emoji : s.emoji,
          }
        : s
    );
    onUpdateClip({ ...currentClip, subtitles: updated });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Helper for subtitle styling preview
  const renderStyledSubtitles = () => {
    if (!activeSubtitle) return null;

    const { text, highlightWord, emoji } = activeSubtitle;
    const style = currentClip.subtitleStyle;

    const positionClasses =
      currentClip.fontPosition === 'top'
        ? 'top-16'
        : currentClip.fontPosition === 'middle'
        ? 'top-1/2 -translate-y-1/2'
        : 'bottom-24';

    if (style === 'hormozi') {
      return (
        <div
          className={`absolute left-4 right-4 ${positionClasses} flex flex-col items-center justify-center text-center pointer-events-none z-20 transition-all`}
        >
          <div
            style={{ fontSize: `${currentClip.fontSize}px` }}
            className="font-black tracking-wider uppercase leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,1)] text-amber-300 transform -rotate-1 animate-in zoom-in-95 duration-100"
          >
            {highlightWord && text.includes(highlightWord) ? (
              <span>
                {text.split(highlightWord)[0]}
                <span className="bg-emerald-500 text-black px-1.5 py-0.5 rounded-md mx-1 inline-block shadow-lg">
                  {highlightWord}
                </span>
                {text.split(highlightWord)[1]}
              </span>
            ) : (
              <span>{text}</span>
            )}
            {emoji && <span className="ml-2 text-3xl inline-block animate-bounce">{emoji}</span>}
          </div>
        </div>
      );
    }

    if (style === 'neon') {
      return (
        <div
          className={`absolute left-4 right-4 ${positionClasses} flex flex-col items-center justify-center text-center pointer-events-none z-20`}
        >
          <div
            style={{ fontSize: `${currentClip.fontSize}px` }}
            className="font-black tracking-widest uppercase text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] animate-pulse"
          >
            {text} {emoji}
          </div>
        </div>
      );
    }

    if (style === 'karaoke') {
      return (
        <div
          className={`absolute left-4 right-4 ${positionClasses} flex flex-col items-center justify-center text-center pointer-events-none z-20`}
        >
          <div
            style={{ fontSize: `${currentClip.fontSize}px` }}
            className="font-extrabold uppercase px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white"
          >
            <span className="text-rose-400 font-black">{text.slice(0, Math.floor(text.length * ((currentTime - activeSubtitle.start) / Math.max(0.1, activeSubtitle.end - activeSubtitle.start))))}</span>
            <span className="opacity-70">{text.slice(Math.floor(text.length * ((currentTime - activeSubtitle.start) / Math.max(0.1, activeSubtitle.end - activeSubtitle.start))))}</span>
            {emoji && <span className="ml-1.5">{emoji}</span>}
          </div>
        </div>
      );
    }

    if (style === 'comic') {
      return (
        <div
          className={`absolute left-4 right-4 ${positionClasses} flex flex-col items-center justify-center text-center pointer-events-none z-20`}
        >
          <div
            style={{ fontSize: `${currentClip.fontSize}px` }}
            className="font-black tracking-wide uppercase text-yellow-400 stroke-black stroke-2 -rotate-2 bg-rose-600 text-white px-2.5 py-1 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {text} {emoji}
          </div>
        </div>
      );
    }

    // minimal
    return (
      <div
        className={`absolute left-6 right-6 ${positionClasses} flex flex-col items-center justify-center text-center pointer-events-none z-20`}
      >
        <div
          style={{ fontSize: `${currentClip.fontSize - 2}px` }}
          className="font-semibold px-3 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-zinc-100 border border-white/10"
        >
          {text} {emoji}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Clip Selector Tabs (Clipes Gerados para este vídeo) */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Clipes Curtos Gerados por IA ({allClips.length})
              </h2>
              <p className="text-[11px] text-zinc-400 line-clamp-1">
                Vídeo Base: {currentClip.originalVideoTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Virality Score:</span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              {currentClip.viralityScore}/100
            </span>
          </div>
        </div>

        {/* Clip Pills */}
        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1 touch-scroll"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allClips.map((clip, idx) => {
            const isSelected = clip.id === currentClip.id;
            return (
              <button
                key={clip.id}
                onClick={() => {
                  onSelectClip(clip);
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-950/40 ring-1 ring-white/20'
                    : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <span>Clipe #{idx + 1}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40">
                  {clip.durationSeconds}s
                </span>
                <span className="text-[10px] text-amber-300">🔥 {clip.viralityScore}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Workspace: Player Preview (Left) + Editor Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Live Video & Captions Player */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Mode Switcher: Animated Subtitles Preview vs Real YouTube Player */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-3 text-xs w-full max-w-[360px] justify-between">
            <button
              onClick={() => setPlayerMode('preview')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
                playerMode === 'preview'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ✨ Legendas 9:16
            </button>
            <button
              onClick={() => setPlayerMode('youtube')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
                playerMode === 'youtube'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ▶️ Vídeo YouTube Real
            </button>
          </div>

          {/* Responsive Vertical Video Player Frame */}
          <div
            className="relative rounded-2xl sm:rounded-3xl border-2 border-zinc-800 bg-black overflow-hidden shadow-2xl transition-all duration-300 w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16]"
          >
            {/* Background Media: Real YouTube Video Embed or Subtitle Preview */}
            <div className="absolute inset-0 z-0">
              {playerMode === 'youtube' ? (
                <iframe
                  className="w-full h-full object-cover scale-[1.35] pointer-events-auto"
                  src={`https://www.youtube.com/embed/${sourceVideo?.youtubeId || 'GNa8Dj1TSU8'}?start=${currentClip.startSecond}&end=${currentClip.endSecond}&autoplay=1&controls=1&playsinline=1`}
                  title={currentClip.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={sourceVideo?.thumbnailUrl || 'https://i.ytimg.com/vi/GNa8Dj1TSU8/hqdefault.jpg'}
                    alt="Background"
                    className="w-full h-full object-cover scale-105 filter blur-xs brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                </>
              )}
            </div>

            {/* Dynamic Captions Layer (Only active in preview mode) */}
            {playerMode === 'preview' && renderStyledSubtitles()}

            {/* TikTok / Reels Overlay UI simulation */}
            {playerMode === 'preview' && (
              <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 pt-10">
                {/* Top tags */}
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold">
                    Seguindo | <strong className="text-rose-400">Para Você</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/80 text-[10px] font-bold">
                    {currentClip.language.toUpperCase()}
                  </span>
                </div>

                {/* Right Side Social Action Icons */}
                <div className="self-end space-y-4 pointer-events-auto flex flex-col items-center text-white">
                  <button
                    onClick={() => {
                      setIsLiked(!isLiked);
                      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
                    }}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform active:scale-125 ${
                        isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
                    </div>
                    <span className="text-[10px] font-bold">{(likesCount / 1000).toFixed(1)}k</span>
                  </button>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold">2.4k</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold">18.9k</span>
                  </div>

                  <button
                    onClick={() => onQuickShare(currentClip)}
                    className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                  >
                    <div className="w-10 h-10 rounded-full bg-rose-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-rose-300">Compartilhar</span>
                  </button>
                </div>

                {/* Bottom Profile & Hook Preview */}
                <div className="space-y-1.5 text-white pr-12">
                  <div className="flex items-center gap-2">
                    <img
                      src={sourceVideo?.thumbnailUrl || 'https://i.ytimg.com/vi/GNa8Dj1TSU8/hqdefault.jpg'}
                      alt={sourceVideo?.channelTitle}
                      className="w-7 h-7 rounded-full object-cover border border-white"
                    />
                    <span className="text-xs font-bold truncate max-w-[150px]">
                      {sourceVideo?.channelTitle || 'Canal Oficial'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-600 font-semibold shrink-0">
                      Original
                    </span>
                  </div>
                  <p className="text-[11px] font-medium line-clamp-2 leading-tight drop-shadow-md">
                    {currentClip.hook}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-300">
                    <Volume2 className="w-3 h-3 text-rose-400" />
                    <span className="truncate">Áudio Original do YouTube</span>
                  </div>
                </div>
              </div>
            )}

            {/* Central Play/Pause Tap Button (In preview mode) */}
            {playerMode === 'preview' && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 z-15 flex items-center justify-center focus:outline-none"
              >
                {!isPlaying && (
                  <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl transform active:scale-90 transition-transform">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                )}
              </button>
            )}
          </div>

          {/* Timeline & Playback Controller */}
          <div className="w-full max-w-[360px] mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono text-white">
                {currentTime.toFixed(1)}s
              </span>
              <span className="text-[11px] text-zinc-300">
                Gancho: {currentClip.startSecond}s - {currentClip.endSecond}s ({duration}s)
              </span>
              <span className="font-mono text-zinc-400">{duration.toFixed(1)}s</span>
            </div>

            {/* Interactive Progress Bar */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Media controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => handleSeek(0)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Pausar' : 'Reproduzir'}</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                title={isMuted ? 'Desmutar' : 'Mutar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Studio Toolbar & Settings */}
        <div className="lg:col-span-7 space-y-5">
          {/* Action Header: Quick Share & Schedule CTA */}
          <div className="bg-gradient-to-r from-zinc-900 to-indigo-950/40 border border-zinc-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {currentClip.title}
              </h3>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" />
                Previsão de Retenção: {currentClip.retentionPrediction}% nos primeiros 5s
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuickShare(currentClip)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/40 active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar</span>
              </button>

              <button
                onClick={() => onScheduleClip(currentClip)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs sm:text-sm transition-all"
              >
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Agendar</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs: Subtitles vs Trim vs Copy */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <button
              onClick={() => setActiveTab('subtitles')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'subtitles'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Legendas & Idiomas</span>
            </button>

            <button
              onClick={() => setActiveTab('trim')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'trim'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Corte & Enquadramento</span>
            </button>

            <button
              onClick={() => setActiveTab('copy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'copy'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Título & Hashtags IA</span>
            </button>
          </div>

          {/* TAB 1: SUBTITLES & MULTI-LANGUAGE */}
          {activeTab === 'subtitles' && (
            <div className="space-y-4">
              {/* Language Selector */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>Idioma das Legendas & Dublagem IA</span>
                  </div>
                  {isTranslating && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-400 animate-pulse font-medium">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Traduzindo com Gemini...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LANGUAGES.map((lang) => {
                    const isSelected = currentClip.language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        disabled={isTranslating}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                          isSelected
                            ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subtitle Style Chooser */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-white block">
                  Estilo Visual da Legenda Dinâmica
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUBTITLE_STYLES.map((st) => {
                    const isSelected = currentClip.subtitleStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => onUpdateClip({ ...currentClip, subtitleStyle: st.id })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-zinc-800 border-rose-500 ring-1 ring-rose-500/40 text-white shadow-md'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{st.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-500" />}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-300 bg-zinc-900/90 px-2 py-1 rounded border border-zinc-800 truncate">
                          {st.preview}
                        </div>
                        <span className="text-[10px] text-zinc-300 mt-1 block">
                          {st.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Font Size & Position Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-300 mb-1">
                      <span>Tamanho da Fonte:</span>
                      <span className="font-bold text-white">{currentClip.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="34"
                      value={currentClip.fontSize}
                      onChange={(e) =>
                        onUpdateClip({ ...currentClip, fontSize: Number(e.target.value) })
                      }
                      className="w-full accent-rose-500"
                    />
                  </div>

                  <div>
                    <span className="text-xs text-zinc-300 block mb-1">Posição na Tela:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['top', 'middle', 'bottom'] as const).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => onUpdateClip({ ...currentClip, fontPosition: pos })}
                          className={`py-1 text-xs font-semibold rounded-lg border uppercase ${
                            currentClip.fontPosition === pos
                              ? 'bg-rose-600 text-white border-rose-500'
                              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          {pos === 'top' ? 'Topo' : pos === 'middle' ? 'Centro' : 'Base'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtitle Segments Live Editor */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Editar Frases & Timestamps ({currentClip.subtitles.length} blocos)
                  </span>
                  <span className="text-[11px] text-zinc-300">
                    Clique para editar o texto ou trocar emojis
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {currentClip.subtitles.map((seg, idx) => (
                    <div
                      key={seg.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between gap-2 ${
                        currentTime >= seg.start && currentTime <= seg.end
                          ? 'bg-rose-950/30 border-rose-500/50 text-white'
                          : 'bg-zinc-950 border-zinc-850 text-zinc-300'
                      }`}
                    >
                      <button
                        onClick={() => handleSeek(seg.start)}
                        className="font-mono text-[11px] text-zinc-300 hover:text-white shrink-0 px-1.5 py-0.5 rounded bg-zinc-900"
                      >
                        {seg.start.toFixed(1)}s
                      </button>

                      {editingSegmentId === seg.id ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            defaultValue={seg.text}
                            onBlur={(e) => {
                              handleUpdateSubtitleText(seg.id, e.target.value);
                              setEditingSegmentId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateSubtitleText(seg.id, (e.target as any).value);
                                setEditingSegmentId(null);
                              }
                            }}
                            autoFocus
                            className="w-full bg-zinc-900 px-2 py-1 rounded text-white border border-rose-500 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingSegmentId(seg.id)}
                          className="flex-1 cursor-pointer hover:text-rose-300 font-medium"
                        >
                          <span>{seg.text}</span>
                          {seg.highlightWord && (
                            <span className="ml-1.5 px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                              Palavra-chave: {seg.highlightWord}
                            </span>
                          )}
                        </div>
                      )}

                      <span className="text-base shrink-0">{seg.emoji || '✨'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRIM & ASPECT RATIO */}
          {activeTab === 'trim' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <span className="text-xs font-bold text-white block">
                  Proporção de Tela & Auto-Reframe (Face-Tracking)
                </span>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: '9:16', label: '9:16 Vertical', sub: 'Shorts, TikTok, Reels' },
                    { id: '1:1', label: '1:1 Quadrado', sub: 'Instagram Feed, LinkedIn' },
                    { id: '16:9', label: '16:9 Paisagem', sub: 'YouTube Padrão, PC' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() =>
                        onUpdateClip({ ...currentClip, aspectRatio: ratio.id as any })
                      }
                      className={`p-3 rounded-xl border text-center transition-all ${
                        currentClip.aspectRatio === ratio.id
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{ratio.label}</div>
                      <div className="text-[10px] text-zinc-300 mt-0.5">{ratio.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Time Trimming */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <span className="text-xs font-bold text-white block">
                  Ajuste Fino de Início e Término do Clipe
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">
                      Segundo Inicial (Hook)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={currentClip.endSecond - 5}
                      value={currentClip.startSecond}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value));
                        onUpdateClip({
                          ...currentClip,
                          startSecond: val,
                          durationSeconds: currentClip.endSecond - val,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">
                      Segundo Final (Conclusão)
                    </label>
                    <input
                      type="number"
                      min={currentClip.startSecond + 5}
                      value={currentClip.endSecond}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onUpdateClip({
                          ...currentClip,
                          endSecond: val,
                          durationSeconds: val - currentClip.startSecond,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
                  <span>Duração Total do Corte:</span>
                  <strong className="text-white font-mono">{duration} segundos</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIRAL COPY & HASHTAGS */}
          {activeTab === 'copy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Título Magnético (Otimizado para Cliques)</span>
                  <button
                    onClick={() => copyToClipboard(currentClip.title, 'title')}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300"
                  >
                    {copiedField === 'title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'title' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={currentClip.title}
                  onChange={(e) => onUpdateClip({ ...currentClip, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Legenda Persuasiva & Chamada para Ação</span>
                  <button
                    onClick={() => copyToClipboard(currentClip.generatedCopy, 'copy')}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300"
                  >
                    {copiedField === 'copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'copy' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={currentClip.generatedCopy}
                  onChange={(e) => onUpdateClip({ ...currentClip, generatedCopy: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Hashtags Estratégicas</span>
                  <button
                    onClick={() =>
                      copyToClipboard(currentClip.suggestedHashtags.join(' '), 'hashtags')
                    }
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300"
                  >
                    {copiedField === 'hashtags' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'hashtags' ? 'Copiado!' : 'Copiar Todas'}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentClip.suggestedHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-rose-400 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
