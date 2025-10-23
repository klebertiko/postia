'use server';

/**
 * @fileOverview Ferramenta de IA (agente) especializada em criar legendas para o Instagram.
 *
 * Este arquivo define uma "ferramenta" que o agente principal pode usar.
 * Esta ferramenta recebe um tópico e retorna uma legenda de post envolvente.
 *
 * - captionGeneratorTool - A ferramenta que pode ser chamada por outros agentes.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema de entrada para a ferramenta: o tópico do post.
const CaptionInputSchema = z.object({
  topic: z
    .string()
    .describe('O tópico para o qual a legenda deve ser criada.'),
});

// Esquema de saída da ferramenta: a legenda gerada.
const CaptionOutputSchema = z.object({
  caption: z
    .string()
    .describe('A legenda do Instagram gerada para o tópico fornecido.'),
});

// Definimos a ferramenta usando `ai.defineTool`.
// Esta é a unidade de trabalho que nosso agente principal irá acionar.
export const captionGeneratorTool = ai.defineTool(
  {
    name: 'captionGenerator',
    description:
      'Gera uma legenda de postagem do Instagram envolvente com base em um tópico. A legenda não deve conter hashtags e deve terminar com uma chamada para ação (CTA) relevante.',
    inputSchema: CaptionInputSchema,
    outputSchema: CaptionOutputSchema,
  },
  // A função assíncrona que executa a lógica da ferramenta.
  async input => {
    // Define o prompt que será enviado ao modelo de IA.
    const prompt = `Você é um especialista em marketing de mídia social para o Instagram.
Gere uma legenda envolvente e relevante para o Instagram com base no seguinte tópico de postagem. Mantenha a legenda abaixo do limite de caracteres do Instagram.
NÃO inclua hashtags na legenda. A legenda DEVE terminar com uma chamada para ação (CTA) clara e relevante para o tópico.

Tópico da postagem: ${input.topic}`;

    // Chama o modelo de IA com o prompt.
    const { text } = await ai.generate({
      prompt: prompt,
    });
    
    // Retorna o resultado no formato definido pelo `outputSchema`.
    // CORREÇÃO: Usar `text` diretamente em vez de `text()`.
    return { caption: text };
  }
);
