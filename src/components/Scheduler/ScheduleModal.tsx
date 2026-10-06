import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { VideoClip, SocialAccount, ScheduledPost, SocialPlatform } from '../../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: VideoClip | null;
  accounts: SocialAccount[];
  onConfirmSchedule: (post: ScheduledPost) => void;
  thumbnailUrl?: string;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  clip,
  accounts,
  onConfirmSchedule,
  thumbnailUrl,
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'tiktok',
    'instagram',
  ]);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date(Date.now() + 4 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [caption, setCaption] = useState(clip?.generatedCopy || '');

  if (!isOpen || !clip) return null;

  const smartSlots = [
    { label: 'Hoje às 18:30 🔥', time: '18:30', tip: 'Pico de audiência no Reels & TikTok' },
    { label: 'Hoje às 21:00 ⚡', time: '21:00', tip: 'Maior tempo de retenção noturna' },
    { label: 'Amanhã às 12:15 🚀', time: '12:15', tip: 'Horário de almoço com alto CTR' },
  ];

  const handleSelectSlot = (slotTime: string) => {
    const today = new Date();
    const [h, m] = slotTime.split(':');
    today.setHours(Number(h), Number(m), 0, 0);
    setScheduledDate(today.toISOString().slice(0, 16));
  };

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlatforms.length === 0) return;

    const targetAccountIds = accounts
      .filter((acc) => acc.isConnected && selectedPlatforms.includes(acc.platform))
      .map((acc) => acc.id);

    const newPost: ScheduledPost = {
      id: `sch_${Date.now()}`,
      clipId: clip.id,
      clipTitle: clip.title,
      clipThumbnail: thumbnailUrl || 'https://i.ytimg.com/vi/GNa8Dj1TSU8/hqdefault.jpg',
      scheduledTime: new Date(scheduledDate).toISOString(),
      platforms: selectedPlatforms,
      targetAccountIds,
      caption: caption || clip.generatedCopy,
      hashtags: clip.suggestedHashtags,
      status: 'agendado',
    };

    onConfirmSchedule(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Agendar Postagem</h2>
            <p className="text-xs text-zinc-400">Automatize o envio nas suas redes conectadas.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Post preview snippet */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <div className="w-12 h-16 rounded-lg bg-zinc-900 overflow-hidden shrink-0">
              <img
                src={thumbnailUrl || 'https://i.ytimg.com/vi/GNa8Dj1TSU8/hqdefault.jpg'}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{clip.title}</h4>
              <p className="text-[11px] text-zinc-400 line-clamp-1">{clip.hook}</p>
              <span className="text-[10px] text-rose-400 font-bold">
                {clip.durationSeconds}s • {clip.viralityScore}% Virality
              </span>
            </div>
          </div>

          {/* Platform multi-select */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Publicar Simultaneamente em:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tiktok' as SocialPlatform, label: 'TikTok', icon: '🎵' },
                { id: 'instagram' as SocialPlatform, label: 'Instagram', icon: '📸' },
                { id: 'youtube' as SocialPlatform, label: 'Shorts', icon: '▶️' },
                { id: 'x' as SocialPlatform, label: 'X (Twitter)', icon: '𝕏' },
                { id: 'linkedin' as SocialPlatform, label: 'LinkedIn', icon: '💼' },
              ].map((plat) => {
                const isSelected = selectedPlatforms.includes(plat.id);
                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => togglePlatform(plat.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-rose-500/10 text-white border-rose-500 shadow-sm'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>{plat.icon}</span>
                    <span className="text-xs font-bold">{plat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Best Times suggestions */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Melhores Horários Sugeridos pelo Algoritmo:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {smartSlots.map((slot) => (
                <button
                  type="button"
                  key={slot.label}
                  onClick={() => handleSelectSlot(slot.time)}
                  className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-amber-300">
                    {slot.label}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{slot.tip}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Picker */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Data e Hora Personalizada
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs sm:text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={selectedPlatforms.length === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40"
            >
              <CalendarIcon className="w-4 h-4" />
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
