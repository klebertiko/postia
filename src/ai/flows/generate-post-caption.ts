'use server';

/**
 * @fileOverview Agente de IA especializado em criar legendas para o Instagram.
 *
 * Este arquivo define um fluxo (flow) que gera uma legenda de post envolvente
 * para um determinado tópico.
 *
 * - generateCaption - A função que pode ser chamada por outros agentes.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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

// Define o fluxo do agente.
const captionGeneratorFlow = ai.defineFlow(
  {
    name: 'captionGeneratorFlow',
    inputSchema: CaptionInputSchema,
    outputSchema: CaptionOutputSchema,
  },
  async input => {
    // Define o prompt para o agente de legenda.
    const prompt = `Você é um especialista em marketing de mídia social para o Instagram.
Sua tarefa é criar uma legenda envolvente e relevante para o tópico: "${input.topic}".

**Requisitos Obrigatórios:**
1.  Escreva uma legenda cativante e informativa.
2.  A legenda NÃO deve conter hashtags.
3.  A legenda DEVE terminar com uma chamada para ação (CTA) clara e relevante para o tópico.

Gere a legenda AGORA.`;

    // Executa o modelo de IA.
    const result = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
      output: {
        schema: CaptionOutputSchema,
      },
    });

    return result.output!;
  }
);
