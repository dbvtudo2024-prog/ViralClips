import React, { useState } from 'react';
import {
  INITIAL_VIDEOS,
  INITIAL_CATEGORIES,
  INITIAL_CLIPS,
  INITIAL_ACCOUNTS,
  INITIAL_SCHEDULED_POSTS,
  INITIAL_ANALYTICS,
} from './data/mockData';
import {
  ViralVideo,
  CustomCategory,
  VideoClip,
  SocialAccount,
  ScheduledPost,
  ClipAnalytics,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, MobileBottomNav } from './components/Sidebar';
import { VideoSearch } from './components/VideoSearch/VideoSearch';
import { ClipStudio } from './components/ClipStudio/ClipStudio';
import { Scheduler } from './components/Scheduler/Scheduler';
import { ScheduleModal } from './components/Scheduler/ScheduleModal';
import { Accounts } from './components/Accounts/Accounts';
import { Analytics } from './components/Analytics/Analytics';
import { QuickShareModal } from './components/QuickShareModal';
import { AutoPipeline } from './components/AutoPipeline/AutoPipeline';
import { geminiService } from './services/geminiService';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('autopilot');

  // Application Data States
  const [videos, setVideos] = useState<ViralVideo[]>(INITIAL_VIDEOS);
  const [categories, setCategories] = useState<CustomCategory[]>(INITIAL_CATEGORIES);
  const [clips, setClips] = useState<VideoClip[]>(INITIAL_CLIPS);
  const [currentClipId, setCurrentClipId] = useState<string>(INITIAL_CLIPS[0].id);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);
  const [analyticsData, setAnalyticsData] = useState<ClipAnalytics[]>(INITIAL_ANALYTICS);

  // Modals & Popups
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedClipForAction, setSelectedClipForAction] = useState<VideoClip | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(
    null
  );

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentClip = clips.find((c) => c.id === currentClipId) || clips[0];
  const sourceVideo = videos.find((v) => v.id === currentClip?.videoId);

  // Handle selecting a video to auto-clip with Gemini AI
  const handleSelectVideoForClipping = async (video: ViralVideo) => {
    setIsAiProcessing(true);
    showToast(`Analisando "${video.title.slice(0, 30)}..." com IA...`, 'info');

    try {
      const analysis = await geminiService.analyzeVideo({
        title: video.title,
        description: video.summary,
        url: video.videoUrl,
        duration: video.duration,
        category: video.category,
      });

      // Transform generated clips
      const newClips: VideoClip[] = analysis.clips.map((c, idx) => ({
        id: `gen_clip_${video.id}_${idx}_${Date.now()}`,
        videoId: video.id,
        originalVideoTitle: video.title,
        title: c.title,
        hook: c.hook,
        startSecond: c.startSecond,
        endSecond: c.endSecond,
        durationSeconds: c.endSecond - c.startSecond,
        viralityScore: c.viralityScore || video.viralityScore,
        aspectRatio: '9:16',
        subtitleStyle: 'hormozi',
        language: 'pt-BR',
        fontSize: 26,
        fontPosition: 'middle',
        suggestedHashtags: c.suggestedHashtags || ['#cortesvirais', '#shorts', '#viral'],
        generatedCopy: `${c.hook} Assista até o final para entender tudo! 👇`,
        recommendedPlatform: c.recommendedPlatform || 'tiktok',
        retentionPrediction: 93,
        thumbnailTime: c.startSecond + 5,
        subtitles: [
          { id: 's1', start: 0, end: 3.5, text: c.hook.toUpperCase(), highlightWord: 'VIRAL', emoji: '🔥' },
          { id: 's2', start: 3.5, end: 8.0, text: 'PRESTE MUITA ATENÇÃO NISSO', highlightWord: 'ATENÇÃO', emoji: '⚡' },
          { id: 's3', start: 8.0, end: 14.0, text: 'A REVELAÇÃO VAI MUDAR SEU DIA', highlightWord: 'MUDAR', emoji: '🤯' },
          { id: 's4', start: 14.0, end: 22.0, text: 'COMPARTILHE COM UM AMIGO AGORA!', highlightWord: 'COMPARTILHE', emoji: '🚀' },
        ],
      }));

      setClips((prev) => [...newClips, ...prev]);
      setCurrentClipId(newClips[0].id);
      setActiveTab('studio');
      showToast(`✨ ${newClips.length} cortes virais gerados com sucesso!`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Erro ao processar vídeo com IA', 'info');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Import custom YouTube URL
  const handleImportCustomUrl = async (url: string) => {
    setIsAiProcessing(true);
    showToast('Buscando dados oficiais do YouTube...', 'info');

    // Extract real YouTube ID from any format (youtu.be, watch?v=, embed, etc.)
    const idMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const youtubeId = idMatch ? idMatch[1] : 'sR5hPq7eev0';

    let realTitle = 'Vídeo Viral do YouTube';
    let realAuthor = 'Canal Oficial';
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
      );
      if (oembedRes.ok) {
        const odata = await oembedRes.json();
        if (odata.title) realTitle = odata.title;
        if (odata.author_name) realAuthor = odata.author_name;
      }
    } catch (_err) {
      // Use fallback title
    }

    const realThumbnail = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

    // Create a new verified viral video entry
    const newVideo: ViralVideo = {
      id: `custom_vid_${youtubeId}_${Date.now()}`,
      youtubeId,
      title: realTitle,
      channelTitle: realAuthor,
      channelAvatar: realThumbnail,
      thumbnailUrl: realThumbnail,
      videoUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      views: 1450000,
      viewsPerHour: 38200,
      duration: '18:30',
      durationSeconds: 1110,
      publishedAt: 'Recém importado do YouTube',
      category: 'cat_all',
      viralityScore: 98,
      potentialClipsCount: 5,
      tags: ['youtube', 'viral', 'corte', 'ia', realAuthor.toLowerCase()],
      summary: `Vídeo oficial "${realTitle}" do canal ${realAuthor}. Conteúdo com alto potencial de engajamento e ganchos nos primeiros 5 segundos.`,
    };

    setVideos((prev) => [newVideo, ...prev]);
    await handleSelectVideoForClipping(newVideo);
  };

  const handleAddCategory = (newCategory: CustomCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Categoria "${newCategory.name}" adicionada com sucesso!`);
  };

  const handleUpdateClip = (updated: VideoClip) => {
    setClips((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleOpenStudioWithClip = (clip: VideoClip) => {
    setCurrentClipId(clip.id);
    setActiveTab('studio');
  };

  const handleAutoScheduleClips = (newClips: VideoClip[], newPosts: ScheduledPost[]) => {
    setClips((prev) => [...newClips, ...prev]);
    setScheduledPosts((prev) => [...newPosts, ...prev]);
    if (newClips.length > 0) {
      setCurrentClipId(newClips[0].id);
    }
    showToast(`✨ ${newClips.length} cortes gerados e agendados nos horários de ouro!`, 'success');
  };

  // Quick share action triggers
  const handleOpenQuickShare = (clip: VideoClip) => {
    setSelectedClipForAction(clip);
    setIsShareModalOpen(true);
  };

  const handleOpenSchedule = (clip?: VideoClip) => {
    setSelectedClipForAction(clip || currentClip);
    setIsScheduleModalOpen(true);
  };

  // Direct Publish Action
  const handleDirectPublish = (clip: VideoClip, platform: string) => {
    // Add to analytics and mark as published
    const newAnalyticsEntry: ClipAnalytics = {
      clipId: clip.id,
      clipTitle: clip.title,
      platform: platform as any,
      publishedDate: 'Agora mesmo',
      views: 1240,
      likes: 310,
      comments: 42,
      shares: 88,
      saves: 145,
      retentionRate: 88.5,
      viralityScore: clip.viralityScore,
      ctr: 7.4,
      profileVisits: 92,
      estimatedEarnings: 'R$ 35,00',
      retentionCurve: [
        { second: 0, percentage: 100 },
        { second: 3, percentage: 94 },
        { second: 6, percentage: 90 },
        { second: 12, percentage: 86 },
        { second: 18, percentage: 82 },
        { second: 24, percentage: 79 },
      ],
    };

    setAnalyticsData((prev) => [newAnalyticsEntry, ...prev]);
    showToast(`Vídeo publicado com sucesso no ${platform.toUpperCase()}! 🔥`);
  };

  // Confirm schedule
  const handleConfirmSchedule = (post: ScheduledPost) => {
    setScheduledPosts((prev) => [post, ...prev]);
    showToast('Post agendado com sucesso no calendário de postagens! 🗓️');
  };

  const handlePublishNow = (post: ScheduledPost) => {
    setScheduledPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, status: 'publicado' } : p))
    );
    showToast(`Post "${post.clipTitle.slice(0, 24)}..." publicado imediatamente! 🚀`);
  };

  const handleDeletePost = (postId: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Post removido da fila de agendamento.', 'info');
  };

  const handleAddAccount = (acc: SocialAccount) => {
    setAccounts((prev) => [...prev, acc]);
    showToast(`Conta ${acc.username} conectada com sucesso! 🟢`);
  };

  const handleToggleAccountStatus = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === 'active' ? 'reauth_needed' : 'active',
              isConnected: a.status !== 'active',
            }
          : a
      )
    );
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    showToast('Conta desvinculada.');
  };

  const activeAccountsCount = accounts.filter((a) => a.isConnected).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAccountsCount={activeAccountsCount}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingClipsCount={clips.length}
          scheduledCount={scheduledPosts.filter((p) => p.status === 'agendado').length}
        />

        {/* Dynamic Content View Area - Fully responsive on both mobile and PC */}
        <main className="flex-1 overflow-y-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6 pb-20 lg:pb-6 transition-all duration-200">
          {activeTab === 'autopilot' && (
            <AutoPipeline
              videos={videos}
              accounts={accounts}
              onAutoScheduleClips={handleAutoScheduleClips}
              onOpenStudioWithClip={handleOpenStudioWithClip}
              onOpenQuickShare={handleOpenQuickShare}
            />
          )}

          {activeTab === 'search' && (
            <VideoSearch
              videos={videos}
              categories={categories}
              onAddCategory={handleAddCategory}
              onSelectVideoForClipping={handleSelectVideoForClipping}
              onImportCustomUrl={handleImportCustomUrl}
            />
          )}

          {activeTab === 'studio' && (
            <ClipStudio
              currentClip={currentClip}
              allClips={clips}
              onSelectClip={(c) => setCurrentClipId(c.id)}
              onUpdateClip={handleUpdateClip}
              onQuickShare={handleOpenQuickShare}
              onScheduleClip={handleOpenSchedule}
              sourceVideo={sourceVideo}
            />
          )}

          {activeTab === 'scheduler' && (
            <Scheduler
              scheduledPosts={scheduledPosts}
              accounts={accounts}
              onPublishNow={handlePublishNow}
              onDeletePost={handleDeletePost}
              onOpenScheduleModal={() => handleOpenSchedule(currentClip)}
            />
          )}

          {activeTab === 'accounts' && (
            <Accounts
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onToggleAccountStatus={handleToggleAccountStatus}
              onRemoveAccount={handleRemoveAccount}
            />
          )}

          {activeTab === 'analytics' && <Analytics analyticsData={analyticsData} />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingClipsCount={clips.length}
      />

      {/* Quick Share Modal */}
      <QuickShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        clip={selectedClipForAction}
        accounts={accounts}
        onDirectPublish={handleDirectPublish}
        thumbnailUrl={
          videos.find((v) => v.id === selectedClipForAction?.videoId)?.thumbnailUrl ||
          'https://i.ytimg.com/vi/GNa8Dj1TSU8/hqdefault.jpg'
        }
      />

      {/* Schedule Post Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        clip={selectedClipForAction}
        accounts={accounts}
        onConfirmSchedule={handleConfirmSchedule}
        thumbnailUrl={
          videos.find((v) => v.id === selectedClipForAction?.videoId)?.thumbnailUrl ||
          'https://i.ytimg.com/vi/GNa8Dj1TSU8/hqdefault.jpg'
        }
      />

      {/* AI Processing Global Overlay */}
      {isAiProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center gap-3 text-center max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-white text-base">IA Analisando Conteúdo</h3>
            <p className="text-xs text-zinc-400">
              Rastreando picos de dopamina, ganchos nos primeiros 3 segundos e gerando cortes automáticos 9:16...
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-indigo-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
