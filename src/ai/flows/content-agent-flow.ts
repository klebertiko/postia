'use server';

/**
 * @fileOverview Fluxo principal do agente orquestrador de conteúdo.
 *
 * Este arquivo define o agente principal que orquestra a geração de conteúdo para um post de Instagram.
 * Ele utiliza "ferramentas" (outros agentes especializados) para gerar a legenda, as hashtags e o prompt de imagem.
 *
 * - generatePostContent - A função principal que inicia o processo de geração.
 * - GeneratePostContentInput - O tipo de entrada para a função.
 * - GeneratePostContentOutput - O tipo de retorno da função.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Importa as ferramentas que o agente principal irá usar.
// Cada ferramenta é um agente especializado em uma tarefa.
import { captionGeneratorTool } from './generate-instagram-caption';
import { hashtagSuggesterTool } from './suggest-relevant-hashtags';
import { imagePromptGeneratorTool } from './generate-gemini-nano-prompt';

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
  return contentAgentFlow(input);
}

// Define o fluxo principal do agente usando `ai.defineFlow`.
const contentAgentFlow = ai.defineFlow(
  {
    name: 'contentAgentFlow',
    inputSchema: GeneratePostContentInputSchema,
    outputSchema: GeneratePostContentOutputSchema,
  },
  // A função assíncrona que define a lógica do agente orquestrador.
  async input => {
    // Define o prompt para o agente principal (orquestrador).
    // Este prompt instrui o agente sobre seu objetivo e como usar as ferramentas disponíveis.
    const prompt = `Você é um agente de IA assistente de marketing de mídia social.
Sua tarefa é gerar o conteúdo completo para um post de Instagram com base em um tópico fornecido pelo usuário.
Você DEVE usar as ferramentas disponíveis para gerar a legenda, as hashtags e um prompt de imagem.
NÃO invente o conteúdo, use as ferramentas para cada parte da tarefa.

Tópico do Post: ${input.postTopic}`;

    // Executa o modelo de IA com o prompt e as ferramentas.
    // O modelo decidirá quais ferramentas chamar com base no prompt.
    // O `await` aqui espera a conclusão de toda a orquestração, incluindo as chamadas às ferramentas.
    const result = await ai.generate({
      prompt: prompt,
      // Fornece a lista de ferramentas que este agente pode usar.
      tools: [
        captionGeneratorTool,
        hashtagSuggesterTool,
        imagePromptGeneratorTool,
      ],
      // Define o formato de saída esperado para o resultado final.
      output: {
        schema: GeneratePostContentOutputSchema,
      },
    });

    // Retorna a saída final estruturada, que o modelo montou após usar as ferramentas.
    return result.output()!;
  }
);
