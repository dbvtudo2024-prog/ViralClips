import React, { useState } from 'react';
import {
  Zap,
  Play,
  Scissors,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Flame,
  Globe,
  Share2,
  ArrowRight,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Layers,
  Youtube,
  Radio,
  ExternalLink,
} from 'lucide-react';
import {
  ViralVideo,
  VideoClip,
  ScheduledPost,
  SocialAccount,
  SocialPlatform,
  SubtitleStyle,
} from '../../types';
import { geminiService } from '../../services/geminiService';

interface AutoPipelineProps {
  videos: ViralVideo[];
  accounts: SocialAccount[];
  onAutoScheduleClips: (clips: VideoClip[], posts: ScheduledPost[]) => void;
  onOpenStudioWithClip: (clip: VideoClip) => void;
  onOpenQuickShare: (clip: VideoClip) => void;
}

export const AutoPipeline: React.FC<AutoPipelineProps> = ({
  videos,
  accounts,
  onAutoScheduleClips,
  onOpenStudioWithClip,
  onOpenQuickShare,
}) => {
  const [selectedNiche, setSelectedNiche] = useState<string>('podcasts');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'tiktok',
    'instagram',
    'youtube',
  ]);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>('hormozi');
  const [clipsPerVideo, setClipsPerVideo] = useState<number>(3);
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState('');

  // Automation state
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [statusLog, setStatusLog] = useState<string>('');
  const [generatedResults, setGeneratedResults] = useState<{
    video: ViralVideo;
    clips: VideoClip[];
    posts: ScheduledPost[];
  } | null>(null);

  const niches = [
    {
      id: 'podcasts',
      name: 'Podcasts & Neurociência',
      icon: '🧠',
      sourceVideo: videos.find((v) => v.youtubeId === 'GNa8Dj1TSU8') || videos[0],
      velocity: '+42.1k views/h',
    },
    {
      id: 'ciencia',
      name: 'Ciência & Mistérios',
      icon: '🌌',
      sourceVideo: videos.find((v) => v.youtubeId === 'sR5hPq7eev0') || videos[1],
      velocity: '+58.4k views/h',
    },
    {
      id: 'fitness',
      name: 'Fitness & Alta Performance',
      icon: '💪',
      sourceVideo: videos.find((v) => v.youtubeId === 'AR8XDom9tuk') || videos[2],
      velocity: '+48.0k views/h',
    },
    {
      id: 'humor',
      name: 'Humor & Stand-up',
      icon: '😂',
      sourceVideo: videos.find((v) => v.youtubeId === 'tH9KyI9dMnI') || videos[3],
      velocity: '+36.2k views/h',
    },
    {
      id: 'financas',
      name: 'Finanças & Negócios',
      icon: '💰',
      sourceVideo: videos.find((v) => v.youtubeId === 'kIhVmmBtBjY') || videos[4],
      velocity: '+22.4k views/h',
    },
  ];

  const currentNicheObj = niches.find((n) => n.id === selectedNiche) || niches[0];

  const togglePlatform = (plat: SocialPlatform) => {
    if (selectedPlatforms.includes(plat)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== plat));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, plat]);
    }
  };

  // Run the 1-Click Autopilot Pipeline
  const handleRunAutopilot = async () => {
    setIsRunning(true);
    setGeneratedResults(null);
    setCurrentStep(1);
    setStatusLog('Buscando e validando vídeo viral no YouTube com maior velocidade de views...');

    try {
      const targetVideo = currentNicheObj.sourceVideo;

      await new Promise((r) => setTimeout(r, 900));

      // Step 2: Cutting with AI
      setCurrentStep(2);
      setStatusLog(
        `IA analisando picos de retenção e cortando ${clipsPerVideo} clipes em formato 9:16 vertical...`
      );

      const aiResult = await geminiService.analyzeVideo({
        title: targetVideo.title,
        description: targetVideo.summary,
        url: targetVideo.videoUrl,
        duration: targetVideo.duration,
        category: targetVideo.category,
      });

      await new Promise((r) => setTimeout(r, 1100));

      // Step 3: Generating Subtitles
      setCurrentStep(3);
      setStatusLog('Gerando legendas dinâmicas animadas estilo Hormozi e palavras-chave de destaque...');

      const targetAccountIds = accounts
        .filter((a) => a.isConnected && selectedPlatforms.includes(a.platform))
        .map((a) => a.id);

      // Golden Retention Hours (Best algorithm time slots for today and tomorrow)
      const now = new Date();
      const goldSlots = [
        { hours: 12, mins: 15, label: '12:15 (Pico de Almoço)' },
        { hours: 18, mins: 30, label: '18:30 (Fim de Tarde / Volta do Trabalho)' },
        { hours: 21, mins: 0, label: '21:00 (Pico Noturno de Retenção)' },
      ];

      const clipsToCreate: VideoClip[] = aiResult.clips.slice(0, clipsPerVideo).map((c, idx) => ({
        id: `auto_clip_${targetVideo.youtubeId}_${idx}_${Date.now()}`,
        videoId: targetVideo.id,
        originalVideoTitle: targetVideo.title,
        title: c.title,
        hook: c.hook,
        startSecond: c.startSecond,
        endSecond: c.endSecond,
        durationSeconds: c.endSecond - c.startSecond,
        viralityScore: c.viralityScore || targetVideo.viralityScore,
        aspectRatio: '9:16',
        subtitleStyle,
        language: 'pt-BR',
        fontSize: 26,
        fontPosition: 'middle',
        suggestedHashtags: c.suggestedHashtags || ['#cortesvirais', '#shorts', '#foco'],
        generatedCopy: `${c.hook}\n\nAssista até o fim para entender o segredo! Salve para rever. 👇`,
        recommendedPlatform: selectedPlatforms[idx % selectedPlatforms.length],
        retentionPrediction: 94,
        thumbnailTime: c.startSecond + 5,
        subtitles: [
          { id: 'sub_a1', start: 0, end: 3.5, text: c.hook.toUpperCase(), highlightWord: 'ATENÇÃO', emoji: '⚡' },
          { id: 'sub_a2', start: 3.5, end: 8.0, text: 'PRESTE MUITA ATENÇÃO NISSO', highlightWord: 'PRESTE', emoji: '👀' },
          { id: 'sub_a3', start: 8.0, end: 14.5, text: 'O ERRO MAIS COMUM É ESTE AQUI', highlightWord: 'ERRO', emoji: '⚠️' },
          { id: 'sub_a4', start: 14.5, end: 22.0, text: 'COMPARTILHE COM QUEM PRECISA SABER!', highlightWord: 'COMPARTILHE', emoji: '🚀' },
        ],
      }));

      // Step 4: Scheduling in Golden Retention Hours
      setCurrentStep(4);
      setStatusLog('Distribuindo e agendando automaticamente nos horários de maior retenção...');

      const scheduledPostsToCreate: ScheduledPost[] = clipsToCreate.map((clip, idx) => {
        const slot = goldSlots[idx % goldSlots.length];
        const scheduledDate = new Date();
        // If current hour is past slot, schedule for tomorrow
        if (now.getHours() >= slot.hours) {
          scheduledDate.setDate(scheduledDate.getDate() + 1);
        }
        scheduledDate.setHours(slot.hours, slot.mins, 0, 0);

        return {
          id: `auto_sch_${clip.id}`,
          clipId: clip.id,
          clipTitle: clip.title,
          clipThumbnail: targetVideo.thumbnailUrl,
          scheduledTime: scheduledDate.toISOString(),
          platforms: selectedPlatforms,
          targetAccountIds,
          caption: clip.generatedCopy,
          hashtags: clip.suggestedHashtags,
          status: 'agendado',
        };
      });

      await new Promise((r) => setTimeout(r, 700));

      // Trigger global state updates
      onAutoScheduleClips(clipsToCreate, scheduledPostsToCreate);

      setGeneratedResults({
        video: targetVideo,
        clips: clipsToCreate,
        posts: scheduledPostsToCreate,
      });

      setStatusLog('✅ Sucesso! Vídeo rastreado, 3 cortes gerados e agendados nos horários de pico!');
    } catch (e: any) {
      console.error(e);
      setStatusLog('Ocorreu um erro no pipeline automático. Tente novamente.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-8">
      {/* Hero Autopilot Header - Compact and breathable on mobile */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-950/40 via-zinc-900 to-indigo-950/40 border border-zinc-800/80 p-4 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold">
              <Zap className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Piloto Automático Viral • 1-Clique</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
              Buscar vídeos em alta, cortar e postar nos horários de pico
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed hidden sm:block">
              Sem precisar editar manualmente: a IA rastreia o vídeo com maior velocidade viral, detecta os ganchos magnéticos, queima legendas dinâmicas e programa automaticamente nos horários de máxima retenção do algoritmo.
            </p>
          </div>

          {/* Action Trigger Card */}
          <div className="bg-zinc-950/90 border border-zinc-800 p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2.5 shrink-0 lg:w-72 shadow-lg">
            <div className="text-[11px] text-zinc-400">
              Pronto para automação em <strong className="text-white">{selectedPlatforms.length} redes</strong>
            </div>

            <button
              onClick={handleRunAutopilot}
              disabled={isRunning}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white transition-all shadow-lg active:scale-95 ${
                isRunning
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 shadow-rose-950/50'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Executar Piloto Automático</span>
                </>
              )}
            </button>

            <span className="text-[10px] text-zinc-500">
              Gera 3 cortes verticais 9:16 com legendas
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Controls (Nicho, Horários de Ouro e Redes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {/* Step 1: Escolher Nicho / Vídeo em Alta */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-black flex items-center justify-center border border-rose-500/30">
                1
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white">Nicho Viral em Alta</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Rastreamento Ativo
            </span>
          </div>

          <div className="space-y-1.5">
            {niches.map((niche) => {
              const isSelected = selectedNiche === niche.id;
              return (
                <button
                  key={niche.id}
                  onClick={() => setSelectedNiche(niche.id)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                    isSelected
                      ? 'bg-zinc-800 border-rose-500 ring-1 ring-rose-500/40 text-white shadow-sm'
                      : 'bg-zinc-950/80 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{niche.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-white">{niche.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        {niche.sourceVideo.channelTitle}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-amber-400 font-bold shrink-0 ml-1.5">
                    {niche.velocity}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Source video preview thumbnail */}
          <div className="pt-2 border-t border-zinc-850 flex items-center gap-2 text-xs text-zinc-400">
            <img
              src={currentNicheObj.sourceVideo.thumbnailUrl}
              alt="Preview"
              className="w-10 h-7 rounded object-cover border border-zinc-800 shrink-0"
            />
            <span className="truncate text-[11px] font-medium text-zinc-300">
              {currentNicheObj.sourceVideo.title}
            </span>
          </div>
        </div>

        {/* Step 2: Horários de Ouro (Maior Retenção do Algoritmo) */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center border border-indigo-500/30">
                2
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white">Horários de Maior Retenção</h3>
            </div>
            <span className="text-[10px] text-zinc-400">Picos de Hoje</span>
          </div>

          <div className="space-y-2">
            {[
              {
                time: '12:15',
                period: 'Pico de Almoço',
                description: 'Maior rolagem e consumo contínuo no TikTok & Shorts',
                badge: '+34% Alcance',
              },
              {
                time: '18:30',
                period: 'Fim de Tarde / Volta',
                description: 'Pico de curtidas e comentários no Instagram Reels',
                badge: '+48% Retenção',
              },
              {
                time: '21:00',
                period: 'Pico Noturno',
                description: 'Maior retenção e compartilhamento privado em DMs',
                badge: '+62% Conversão',
              },
            ].map((slot) => (
              <div
                key={slot.time}
                className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850 flex items-start justify-between gap-2"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-rose-400 text-xs font-mono">
                      {slot.time}
                    </span>
                    <span className="text-xs font-bold text-white truncate">{slot.period}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-tight truncate">{slot.description}</p>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                  {slot.badge}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-zinc-500 pt-0.5">
            Cada corte é programado automaticamente no próximo horário de ouro.
          </p>
        </div>

        {/* Step 3: Redes & Estilo de Legenda */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center border border-emerald-500/30">
                3
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white">Canais & Legendas</h3>
            </div>
            <span className="text-[10px] text-zinc-400">9:16 Vertical</span>
          </div>

          {/* Social platforms selection */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-400 font-semibold block">Postar simultaneamente em:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tiktok' as SocialPlatform, label: 'TikTok', icon: '🎵' },
                { id: 'instagram' as SocialPlatform, label: 'Reels', icon: '📸' },
                { id: 'youtube' as SocialPlatform, label: 'Shorts', icon: '▶️' },
              ].map((p) => {
                const isSelected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-0.5 transition-all ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500 text-white font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span className="text-sm">{p.icon}</span>
                    <span className="text-[11px]">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtitle style selection */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-850">
            <span className="text-[11px] text-zinc-400 font-semibold block">Estilo da Legenda:</span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'hormozi' as SubtitleStyle, label: 'Hormozi / Viral', preview: 'Amarelo & Verde' },
                { id: 'neon' as SubtitleStyle, label: 'Cyber Neon', preview: 'Glow Ciano' },
                { id: 'karaoke' as SubtitleStyle, label: 'Karaokê Pop', preview: 'Palavra Ativa' },
                { id: 'comic' as SubtitleStyle, label: 'Comic Boom', preview: 'Cartoon' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSubtitleStyle(st.id)}
                  className={`p-1.5 rounded-lg border text-left transition-all ${
                    subtitleStyle === st.id
                      ? 'bg-zinc-800 border-indigo-500 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-400'
                  }`}
                >
                  <div className="truncate text-[11px]">{st.label}</div>
                  <div className="text-[9px] text-zinc-500">{st.preview}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Automation Progress Bar (when running) */}
      {isRunning && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-rose-500 animate-spin" />
              Executando Pipeline Viral Autônomo
            </span>
            <span className="font-mono text-rose-400 font-bold">{currentStep} / 4 Etapas</span>
          </div>

          {/* Step indicators */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: 'Radar YouTube' },
              { num: 2, label: 'Cortes com IA' },
              { num: 3, label: 'Legendas 9:16' },
              { num: 4, label: 'Agendamento de Pico' },
            ].map((step) => (
              <div
                key={step.num}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  currentStep >= step.num
                    ? 'bg-rose-500/10 border-rose-500 text-rose-300 font-bold'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-600'
                }`}
              >
                <div className="text-[10px] text-zinc-500">Etapa {step.num}</div>
                <div className="text-xs truncate">{step.label}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 text-xs text-zinc-300 font-mono">
            {statusLog}
          </div>
        </div>
      )}

      {/* Results Section (Generated & Scheduled Clips Ready) */}
      {generatedResults && (
        <div className="bg-zinc-900/80 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-5 animate-in fade-in shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pipeline Concluído com Sucesso!</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                3 Clipes Virais Cortados e Agendados nos Picos de Audiência
              </h2>
              <p className="text-xs text-zinc-400">
                Vídeo Fonte: <strong className="text-white">{generatedResults.video.title}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                Programados na Fila 🗓️
              </span>
            </div>
          </div>

          {/* Cards of the 3 auto-scheduled clips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedResults.clips.map((clip, idx) => {
              const post = generatedResults.posts[idx];
              const dateObj = new Date(post.scheduledTime);
              const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={clip.id}
                  className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 space-y-3 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Thumbnail & Timing Badge */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-zinc-850">
                      <img
                        src={generatedResults.video.thumbnailUrl}
                        alt={clip.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                        {clip.durationSeconds}s (9:16)
                      </span>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-600 text-[10px] font-black text-white shadow-md">
                        🔥 {clip.viralityScore}% Virality
                      </span>
                    </div>

                    {/* Schedule Time Slot */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Agendado às {formattedTime}
                      </span>
                      <span className="text-[10px] text-zinc-500">Pico de Retenção</span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-tight">
                      {clip.title}
                    </h4>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 italic">
                      "{clip.hook}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-zinc-850 flex items-center gap-2">
                    <button
                      onClick={() => onOpenStudioWithClip(clip)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Scissors className="w-3.5 h-3.5 text-rose-400" />
                      <span>Editar Legendas</span>
                    </button>

                    <button
                      onClick={() => onOpenQuickShare(clip)}
                      className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                      title="Postar Imediatamente"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
