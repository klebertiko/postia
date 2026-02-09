'use server';

import { z } from 'zod';
import type { GeneratedContent } from '@/lib/types';
import { generateConsolidatedContent } from '@/ai/flows/consolidated-post-flow';

const formSchema = z.object({
  postTopic: z.string().min(1, 'O tópico do post é obrigatório.'),
});

const MAX_HASHTAGS = 15;

/**
 * Server Action para gerar conteúdo de post.
 * Valida a entrada, chama o fluxo principal de IA e formata a saída.
 * @param data Os dados brutos do formulário.
 * @returns Um objeto com os dados gerados ou um erro.
 */
export async function generateContentAction(
  data: unknown
): Promise<{ data: GeneratedContent | null; error: string | null }> {
  const validation = formSchema.safeParse(data);

  if (!validation.success) {
    console.error('Validation error:', validation.error.flatten());
    return { data: null, error: 'Dados de entrada inválidos.' };
  }

  const { postTopic } = validation.data;

  try {
    const result = await generateConsolidatedContent({ topic: postTopic });

    // Validação robusta da resposta da IA.
    if (!result?.caption || !result?.hashtags || !result?.imagePrompt) {
      throw new Error('A IA não conseguiu gerar todo o conteúdo esperado.');
    }

    return {
      data: {
        caption: result.caption,
        hashtags: result.hashtags.slice(0, MAX_HASHTAGS), // Limita as hashtags para um número razoável.
        imagePrompt: result.imagePrompt,
        imageUrl: result.imageUrl,
      },
      error: null,
    };
  } catch (error) {
    console.error('[GenerateContentAction Error]', error);
    // Para o usuário, uma mensagem genérica é mais segura e amigável.
    return {
      data: null,
      error: 'Ocorreu um erro ao comunicar com a IA. Por favor, tente novamente.',
    };
  }
}
