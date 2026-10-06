import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API endpoint to analyze a video or search topic for viral clips
app.post('/api/ai/analyze-video', async (req, res) => {
  try {
    const { title, description, url, duration, category } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'Gemini API não configurada ou usando modo demonstrativo integrado.',
      });
    }

    const prompt = `Você é um diretor de conteúdo viral de Shorts, TikTok e Reels (especialista estilo Opus Clip e MrBeast).
Analise as informações do vídeo do YouTube e identifique os melhores momentos para cortes virais.
Título: ${title || 'Vídeo Viral'}
Descrição/Nicho: ${description || category || 'Geral'}
URL: ${url || ''}
Duração estimada: ${duration || '12:40'}

Gere 3 a 5 cortes curtos (shorts) altamente virais desse conteúdo.
Retorne um JSON estrito com a seguinte estrutura:
{
  "viralScore": number (0-100),
  "viralAnalysis": string (resumo do potencial viral),
  "clips": [
    {
      "title": string (título magnético do clipe com gancho emocional),
      "hook": string (frase do primeiro segundo que prende a atenção),
      "startSecond": number,
      "endSecond": number,
      "duration": string (ex: "0:38"),
      "viralityScore": number (0-100),
      "retentionPrediction": string (ex: "92% retenção nos primeiros 5s"),
      "suggestedHashtags": ["#tag1", "#tag2", "#tag3"],
      "recommendedPlatform": "TikTok" | "Reels" | "Shorts" | "Todas",
      "summary": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error analyzing video with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao processar análise com IA',
    });
  }
});

// API endpoint to generate multilingual captions with timestamps & viral emojis
app.post('/api/ai/generate-captions', async (req, res) => {
  try {
    const { text, targetLanguage, durationSeconds } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'Modo offline/demonstração ativo.',
      });
    }

    const prompt = `Você é um gerador de legendas dinâmicas de alta retenção para Shorts/Reels/TikTok.
Texto base do áudio: "${text || 'O segredo que ninguém te contou sobre o sucesso nos primeiros 30 segundos.'}"
Idioma alvo: "${targetLanguage || 'pt-BR'}"
Duração do clipe em segundos: ${durationSeconds || 30}

Gere as legendas divididas em segmentos curtos (máximo 4 a 6 palavras por segmento) para efeito de leitura rápida e dinâmica no vídeo.
Inclua palavras-chave de destaque ("highlightWord") e emojis virais.

Retorne um JSON estrito no formato:
{
  "language": "${targetLanguage || 'pt-BR'}",
  "translatedFullText": string,
  "segments": [
    {
      "start": number (segundo inicial ex: 0.0),
      "end": number (segundo final ex: 2.5),
      "text": string (texto em maiúsculas ou estilizado),
      "highlightWord": string (palavra de maior impacto para trocar de cor),
      "emoji": string (emoji correspondente)
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating captions:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao gerar legendas com IA',
    });
  }
});

// API endpoint to discover viral trending topics on YouTube
app.post('/api/ai/trending-ideas', async (req, res) => {
  try {
    const { niche } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
      });
    }

    const prompt = `Quais são as principais tendências de vídeos virais e formatos mais quentes no YouTube e TikTok no nicho: "${niche || 'Geral/Podcasts'}"?
Retorne um JSON estrito:
{
  "trends": [
    {
      "keyword": string,
      "estimatedViews": string,
      "growthRate": string (ex: "+240% esta semana"),
      "hookIdea": string,
      "targetAudience": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error fetching trending ideas:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`ViralClip Studio server running on port ${port}`);
  });
}

export { app };
export default app;

if (!process.env.VERCEL) {
  startServer();
}
