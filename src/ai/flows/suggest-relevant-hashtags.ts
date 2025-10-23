'use server';

/**
 * @fileOverview Ferramenta de IA (agente) especializada em sugerir hashtags para o Instagram.
 *
 * Este arquivo define uma "ferramenta" que o agente principal pode usar.
 * Esta ferramenta recebe um tópico e retorna uma lista de hashtags relevantes.
 *
 * - hashtagSuggesterTool - A ferramenta que pode ser chamada por outros agentes.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema de entrada para a ferramenta: o tópico do post.
const HashtagInputSchema = z.object({
  topic: z
    .string()
    .describe('O tópico para o qual as hashtags devem ser sugeridas.'),
});

// Esquema de saída da ferramenta: uma lista de hashtags.
const HashtagOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe('Uma lista de hashtags relevantes para o tópico.'),
});

// Definimos a ferramenta usando `ai.defineTool`.
// Esta é a unidade de trabalho que nosso agente principal irá acionar.
export const hashtagSuggesterTool = ai.defineTool(
  {
    name: 'hashtagSuggester',
    description:
      'Sugere uma lista de hashtags relevantes para o Instagram com base em um tópico de postagem. Não inclua o caractere #.',
    inputSchema: HashtagInputSchema,
    outputSchema: HashtagOutputSchema,
  },
  // A função assíncrona que executa a lógica da ferramenta.
  async input => {
    // Define o prompt que será enviado ao modelo de IA.
    // O `output` com `schema: HashtagOutputSchema` instrui o modelo a retornar um JSON formatado.
    const result = await ai.generate({
      prompt: `Você é um especialista em marketing de mídia social para o Instagram.
Dado o seguinte tópico de postagem, sugira uma lista de hashtags relevantes. Não inclua o caractere '#' na resposta.

Tópico da postagem: ${input.topic}`,
      output: {
        schema: HashtagOutputSchema,
      },
    });

    // Retorna o resultado no formato definido pelo `outputSchema`.
    // CORREÇÃO: Usar `result.output` em vez de `result.output()`.
    return result.output!;
  }
);
