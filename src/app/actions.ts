'use server';

import { generateInstagramCaption } from '@/ai/flows/generate-instagram-caption';
import { suggestRelevantHashtags } from '@/ai/flows/suggest-relevant-hashtags';
import { generateGeminiNanoPrompt } from '@/ai/flows/generate-gemini-nano-prompt';
import { z } from 'zod';
import type { GeneratedContent } from '@/lib/types';

const formSchema = z.object({
  postTopic: z.string().min(1, 'O tópico do post é obrigatório.'),
});

export async function generateContentAction(
  data: unknown
): Promise<{ data: GeneratedContent | null; error: string | null }> {
  const validation = formSchema.safeParse(data);

  if (!validation.success) {
    return { data: null, error: 'Dados de entrada inválidos.' };
  }
  
  const { postTopic } = validation.data;

  try {
    const [captionResult, hashtagsResult, promptResult] = await Promise.all([
      generateInstagramCaption({ postTopic }),
      suggestRelevantHashtags({ postTopic }),
      generateGeminiNanoPrompt({ postTopic }),
    ]);

    if (!captionResult?.caption || !hashtagsResult?.hashtags || !promptResult?.prompt) {
        throw new Error('A IA não conseguiu gerar todo o conteúdo.');
    }

    return {
      data: {
        caption: captionResult.caption,
        hashtags: hashtagsResult.hashtags.slice(0, 15), // Limit hashtags
        prompt: promptResult.prompt,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return { data: null, error: 'Ocorreu um erro ao comunicar com a IA. Por favor, tente novamente.' };
  }
}
