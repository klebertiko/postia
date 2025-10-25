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
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Importa as funções exportadas dos fluxos especializados.
import { generateCaption } from './generate-instagram-caption';
import { suggestHashtags } from './suggest-relevant-hashtags';
import { generateImagePrompt } from './generate-gemini-nano-prompt';

// Esquema de entrada para o fluxo principal: o tópico do post.
const GeneratePostContentInputSchema = z.object({
  postTopic: z.string().describe('O tópico do post do Instagram.'),
});
export type GeneratePostContentInput = z.infer<
  typeof GeneratePostContentInputSchema
>;

// Esquema de saída do fluxo principal: o conteúdo completo do post.
const GeneratePostContentOutputSchema = z.object({
  caption: z.string().describe('A legenda gerada para o post.'),
  hashtags: z
    .array(z.string())
    .describe('A lista de hashtags sugeridas para o post.'),
  imagePrompt: z.string().describe('O prompt de imagem gerado para o post.'),
});
export type GeneratePostContentOutput = z.infer<
  typeof GeneratePostContentOutputSchema
>;

// Função de invólucro (wrapper) que será chamada pela nossa aplicação.
export async function generatePostContent(
  input: GeneratePostContentInput
): Promise<GeneratePostContentOutput> {
  // Chama os agentes em paralelo para otimizar o tempo de resposta.
  const [captionResult, hashtagResult, imagePromptResult] = await Promise.all([
    generateCaption({ topic: input.postTopic }),
    suggestHashtags({ topic: input.postTopic }),
    generateImagePrompt({ topic: input.postTopic }),
  ]);

  return {
    caption: captionResult.caption,
    hashtags: hashtagResult.hashtags,
    imagePrompt: imagePromptResult.imagePrompt,
  };
}
