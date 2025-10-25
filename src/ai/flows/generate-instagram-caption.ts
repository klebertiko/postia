'use server';

/**
 * @fileOverview Agente de IA especializado em criar legendas para o Instagram.
 *
 * Este arquivo define um fluxo (flow) que usa uma ferramenta de busca para obter
 * contexto sobre um tópico e, em seguida, gera uma legenda de post envolvente.
 *
 * - generateCaption - A função que pode ser chamada por outros agentes.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleSearchTool } from '../tools/google-search-tool';

// Esquema de entrada para o fluxo: o tópico do post.
const CaptionInputSchema = z.object({
  topic: z
    .string()
    .describe('O tópico para o qual a legenda deve ser criada.'),
});
export type CaptionInput = z.infer<typeof CaptionInputSchema>;

// Esquema de saída do fluxo: a legenda gerada.
const CaptionOutputSchema = z.object({
  caption: z
    .string()
    .describe('A legenda do Instagram gerada para o tópico fornecido.'),
});
export type CaptionOutput = z.infer<typeof CaptionOutputSchema>;

// Função de invólucro (wrapper) que será chamada por outros agentes.
export async function generateCaption(
  input: CaptionInput
): Promise<CaptionOutput> {
  return captionGeneratorFlow(input);
}

// Define o fluxo do agente que agora pode usar ferramentas.
const captionGeneratorFlow = ai.defineFlow(
  {
    name: 'captionGeneratorFlow',
    inputSchema: CaptionInputSchema,
    outputSchema: CaptionOutputSchema,
  },
  async input => {
    // Define o prompt para o agente de legenda.
    // Ele agora tem a responsabilidade de usar a ferramenta de busca.
    const prompt = `Você é um especialista em marketing de mídia social para o Instagram.
Sua tarefa é criar uma legenda envolvente e relevante.

**Processo Obrigatório:**
1.  Analise o tópico: "${input.topic}".
2.  Use a ferramenta 'googleSearchTool' para obter contexto, fatos interessantes ou pontos de vista atuais sobre o tópico.
3.  Com base nos resultados da busca, escreva uma legenda cativante e informativa.
4.  A legenda NÃO deve conter hashtags.
5.  A legenda DEVE terminar com uma chamada para ação (CTA) clara e relevante para o tópico.

Gere a legenda AGORA, seguindo rigorosamente o processo.`;

    // Executa o modelo de IA, fornecendo a ferramenta de busca.
    const result = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
      tools: [googleSearchTool],
      output: {
        schema: CaptionOutputSchema,
      },
    });

    return result.output!;
  }
);
