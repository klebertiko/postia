'use server';

/**
 * @fileOverview Fluxo principal do agente orquestrador de conteúdo.
 *
 * Este arquivo define o agente principal que orquestra a geração de conteúdo para um post de Instagram.
 * Ele chama outros agentes especializados (fluxos) para gerar a legenda, as hashtags e o prompt de imagem.
 *
 * - generatePostContent - A função principal que inicia o processo de geração.
 * - GeneratePostContentInput - O tipo de entrada para a função.
 * - GeneratePostContentOutput - O tipo de retorno da função.
 */
import { z } from 'genkit';

// Importa as funções exportadas dos fluxos especializados.
import { generateCaption } from './generate-post-caption';
import { suggestHashtags } from './suggest-relevant-hashtags';
import { generateImagePrompt } from './generate-image-prompt';
import type { GeneratePostContentOutput } from '@/lib/types';

// Esquema de entrada para o fluxo principal: o tópico do post.
const GeneratePostContentInputSchema = z.object({
  postTopic: z.string().describe('O tópico do post do Instagram.'),
});
export type GeneratePostContentInput = z.infer<
  typeof GeneratePostContentInputSchema
>;

/**
 * Função orquestradora que coordena os agentes de IA para gerar o conteúdo completo do post.
 * @param input O objeto de entrada contendo o tópico do post.
 * @returns Uma promessa que resolve para o conteúdo completo do post (legenda, hashtags e prompt de imagem).
 */
export async function generatePostContent(
  input: GeneratePostContentInput
): Promise<GeneratePostContentOutput> {
  // Chama os agentes especializados em paralelo para otimizar o tempo de resposta.
  // Promise.all executa todas as promessas simultaneamente.
  const [captionResult, hashtagResult, imagePromptResult] = await Promise.all([
    generateCaption({ topic: input.postTopic }),
    suggestHashtags({ topic: input.postTopic }),
    generateImagePrompt({ topic: input.postTopic }),
  ]);

  // Retorna um objeto consolidado com os resultados de cada agente.
  return {
    caption: captionResult.caption,
    hashtags: hashtagResult.hashtags,
    imagePrompt: imagePromptResult.imagePrompt,
  };
}
