import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
  FileText,
  Video,
} from 'lucide-react';
import { VideoClip, SocialAccount } from '../types';

interface QuickShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: VideoClip | null;
  accounts: SocialAccount[];
  onDirectPublish: (clip: VideoClip, platform: string) => void;
  thumbnailUrl?: string;
}

export const QuickShareModal: React.FC<QuickShareModalProps> = ({
  isOpen,
  onClose,
  clip,
  accounts,
  onDirectPublish,
  thumbnailUrl,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [publishingPlatform, setPublishingPlatform] = useState<string | null>(null);
  const [publishedSuccess, setPublishedSuccess] = useState<string | null>(null);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  if (!isOpen || !clip) return null;

  const platforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      color: 'from-pink-600 to-rose-600',
      icon: '🎵',
      account: accounts.find((a) => a.platform === 'tiktok' && a.isConnected),
    },
    {
      id: 'instagram',
      name: 'Instagram Reels',
      color: 'from-purple-600 via-pink-600 to-amber-600',
      icon: '📸',
      account: accounts.find((a) => a.platform === 'instagram' && a.isConnected),
    },
    {
      id: 'youtube',
      name: 'YouTube Shorts',
      color: 'from-red-600 to-rose-700',
      icon: '▶️',
      account: accounts.find((a) => a.platform === 'youtube' && a.isConnected),
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      color: 'from-zinc-800 to-zinc-900',
      icon: '𝕏',
      account: accounts.find((a) => a.platform === 'x' && a.isConnected),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: 'from-blue-700 to-indigo-800',
      icon: '💼',
      account: accounts.find((a) => a.platform === 'linkedin' && a.isConnected),
    },
  ];

  const handleShareClick = (platformId: string) => {
    setPublishingPlatform(platformId);
    setTimeout(() => {
      setPublishingPlatform(null);
      setPublishedSuccess(platformId);
      onDirectPublish(clip, platformId);
      setTimeout(() => setPublishedSuccess(null), 3000);
    }, 1200);
  };

  const handleDownloadSRT = () => {
    const srtContent = clip.subtitles
      .map((seg, idx) => {
        const formatTime = (secs: number) => {
          const m = Math.floor(secs / 60);
          const s = Math.floor(secs % 60);
          const ms = Math.floor((secs % 1) * 1000);
          return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
        };
        return `${idx + 1}\n${formatTime(seg.start)} --> ${formatTime(seg.end)}\n${seg.text}\n`;
      })
      .join('\n');

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, '_')}_legendas.srt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMP4 = () => {
    setIsExportingVideo(true);
    setExportProgress(10);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExportingVideo(false);
          // Trigger download of a sample MP4 container or text receipt
          const sampleBlob = new Blob(
            [`Exportação ViralClip Studio Pro: ${clip.title} (9:16 vertical render)`],
            { type: 'video/mp4' }
          );
          const url = URL.createObjectURL(sampleBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, '_')}_render_9x16.mp4`;
          link.click();
          URL.revokeObjectURL(url);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const fullShareText = `${clip.title}\n\n${clip.generatedCopy}\n\n${clip.suggestedHashtags.join(' ')}`;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-rose-600/10 text-rose-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Compartilhamento Rápido</h2>
            <p className="text-xs text-zinc-400">
              Publique diretamente nas redes conectadas ou exporte o vídeo com legendas.
            </p>
          </div>
        </div>

        {/* Clip Summary Card */}
        <div className="p-3.5 my-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
          <div className="w-14 h-20 rounded-lg bg-zinc-900 overflow-hidden relative shrink-0">
            <img
              src={thumbnailUrl || 'https://i.ytimg.com/vi/GNa8Dj1TSU8/hqdefault.jpg'}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 px-1 rounded text-white font-mono">
              {clip.durationSeconds}s
            </span>
          </div>

          <div className="space-y-1 flex-1">
            <span className="text-[11px] font-bold text-rose-400">
              Score Viral: {clip.viralityScore}/100 🔥
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{clip.title}</h4>
            <p className="text-[11px] text-zinc-400 line-clamp-1">{clip.hook}</p>
          </div>
        </div>

        {/* 1-Click Social Publishing Buttons */}
        <div className="space-y-2 mb-5">
          <span className="text-xs font-bold text-zinc-300 block">
            Publicar em 1 Clique (Contas Vinculadas)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {platforms.map((p) => {
              const isPublishing = publishingPlatform === p.id;
              const isSuccess = publishedSuccess === p.id;
              const isConnected = !!p.account;

              return (
                <button
                  key={p.id}
                  disabled={isPublishing || !isConnected}
                  onClick={() => handleShareClick(p.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                    isConnected
                      ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-white'
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{p.icon}</span>
                    <div>
                      <div className="text-xs font-bold leading-none">{p.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-1">
                        {isConnected ? p.account?.username : 'Não conectado'}
                      </div>
                    </div>
                  </div>

                  {isPublishing ? (
                    <span className="text-[11px] text-amber-400 font-semibold animate-pulse">
                      Postando...
                    </span>
                  ) : isSuccess ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Postado!
                    </span>
                  ) : isConnected ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Publicar
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-600">Conectar</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Copy All Text & Hashtags */}
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">
              Copiar Título, Legenda e Hashtags
            </span>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1 text-xs text-rose-400 font-semibold hover:text-rose-300"
            >
              {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copiado para Área de Transferência!' : 'Copiar Tudo'}</span>
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 line-clamp-2 italic bg-zinc-900/60 p-2 rounded-lg">
            "{fullShareText.slice(0, 140)}..."
          </p>
        </div>

        {/* Direct Download Section */}
        <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleExportMP4}
            disabled={isExportingVideo}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 active:scale-95 transition-all"
          >
            <Video className="w-4 h-4" />
            <span>
              {isExportingVideo
                ? `Renderizando Vídeo (${exportProgress}%)...`
                : 'Baixar Vídeo Vertical (MP4)'}
            </span>
          </button>

          <button
            onClick={handleDownloadSRT}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Baixar Legendas (.SRT)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
