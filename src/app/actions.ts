'use server';

import { z } from 'zod';
import type { GeneratedContent } from '@/lib/types';
import { generatePostContent } from '@/ai/flows/content-agent-flow';

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
    // Agora, chamamos apenas o fluxo principal do agente orquestrador.
    // Ele cuidará de chamar os outros agentes para gerar o conteúdo.
    const result = await generatePostContent({ postTopic });

    if (!result?.caption || !result?.hashtags || !result?.imagePrompt) {
        throw new Error('A IA não conseguiu gerar todo o conteúdo.');
    }

    return {
      data: {
        caption: result.caption,
        hashtags: result.hashtags.slice(0, 15), // Limita as hashtags
        prompt: result.imagePrompt,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return { data: null, error: 'Ocorreu um erro ao comunicar com a IA. Por favor, tente novamente.' };
  }
}
