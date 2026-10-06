export type SocialPlatform = 'tiktok' | 'instagram' | 'youtube' | 'x' | 'linkedin';

export interface ViralVideo {
  id: string;
  youtubeId: string;
  title: string;
  channelTitle: string;
  channelAvatar: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  viewsPerHour: number;
  duration: string;
  durationSeconds: number;
  publishedAt: string;
  category: string;
  viralityScore: number; // 0-100
  potentialClipsCount: number;
  tags: string[];
  summary: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  videoCount: number;
  keywords: string[];
  minViewsPerHour?: number;
}

export interface SubtitleSegment {
  id: string;
  start: number; // in seconds
  end: number;
  text: string;
  highlightWord?: string;
  emoji?: string;
}

export type SubtitleStyle = 'hormozi' | 'neon' | 'minimal' | 'karaoke' | 'comic';

export type SubtitleLanguage = 'pt-BR' | 'en' | 'es' | 'fr' | 'de' | 'ja';

export interface VideoClip {
  id: string;
  videoId: string;
  originalVideoTitle: string;
  title: string;
  hook: string;
  startSecond: number;
  endSecond: number;
  durationSeconds: number;
  viralityScore: number;
  aspectRatio: '9:16' | '1:1' | '16:9';
  subtitleStyle: SubtitleStyle;
  language: SubtitleLanguage;
  subtitles: SubtitleSegment[];
  fontSize: number; // e.g. 24
  fontPosition: 'top' | 'middle' | 'bottom';
  suggestedHashtags: string[];
  generatedCopy: string;
  recommendedPlatform: SocialPlatform;
  retentionPrediction: number; // e.g. 88%
  thumbnailTime: number;
}

export interface ScheduledPost {
  id: string;
  clipId: string;
  clipTitle: string;
  clipThumbnail: string;
  scheduledTime: string; // ISO string
  platforms: SocialPlatform[];
  targetAccountIds: string[];
  caption: string;
  hashtags: string[];
  status: 'agendado' | 'publicando' | 'publicado' | 'falha';
  publishedAt?: string;
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatarUrl: string;
  followers: number;
  postsThisMonth: number;
  avgViews: number;
  isConnected: boolean;
  tokenExpiresAt: string;
  status: 'active' | 'reauth_needed' | 'paused';
}

export interface ClipAnalytics {
  clipId: string;
  clipTitle: string;
  platform: SocialPlatform;
  publishedDate: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  retentionRate: number; // e.g. 82%
  retentionCurve: { second: number; percentage: number }[];
  viralityScore: number;
  ctr: number; // Click through rate e.g. 4.8%
  profileVisits: number;
  estimatedEarnings?: string;
}
