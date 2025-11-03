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

// Define o prompt reutilizável para o agente de legenda.
const captionGenerator = ai.definePrompt({
  name: 'captionGenerator',
  input: { schema: CaptionInputSchema },
  output: { schema: CaptionOutputSchema },
  prompt: `Você é um especialista em marketing de mídia social para o Instagram.
Sua tarefa é criar uma legenda envolvente e relevante para o tópico: "{{topic}}".

**Requisitos Obrigatórios:**
1.  Escreva uma legenda cativante e informativa.
2.  A legenda NÃO deve conter hashtags.
3.  A legenda DEVE terminar com uma chamada para ação (CTA) clara e relevante para o tópico.

Gere a legenda AGORA.`,
});

// Define o fluxo que utiliza o prompt.
const captionGeneratorFlow = ai.defineFlow(
  {
    name: 'captionGeneratorFlow',
    inputSchema: CaptionInputSchema,
    outputSchema: CaptionOutputSchema,
  },
  async input => {
    const { output } = await captionGenerator(input);
    return output!;
  }
);

/**
 * Função de invólucro (wrapper) que será chamada por outros agentes.
 * @param input O tópico para a legenda.
 * @returns A legenda gerada.
 */
export async function generateCaption(
  input: CaptionInput
): Promise<CaptionOutput> {
  return captionGeneratorFlow(input);
}
