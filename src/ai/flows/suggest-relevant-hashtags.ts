'use server';

/**
 * @fileOverview Agente de IA especializado em sugerir hashtags para o Instagram.
 *
 * Este arquivo define um fluxo (flow) que sugere uma lista de hashtags
 * otimizadas para um determinado tópico.
 *
 * - suggestHashtags - A função que pode ser chamada por outros agentes.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema de entrada para o fluxo: o tópico do post.
const HashtagInputSchema = z.object({
  topic: z
    .string()
    .describe('O tópico para o qual as hashtags devem ser sugeridas.'),
});
export type HashtagInput = z.infer<typeof HashtagInputSchema>;

// Esquema de saída do fluxo: uma lista de hashtags.
const HashtagOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe('Uma lista de hashtags relevantes para o tópico.'),
});
export type HashtagOutput = z.infer<typeof HashtagOutputSchema>;

// Define o prompt reutilizável para o agente de hashtags.
const hashtagSuggester = ai.definePrompt({
  name: 'hashtagSuggester',
  input: { schema: HashtagInputSchema },
  output: { schema: HashtagOutputSchema },
  prompt: `Você é um especialista em marketing de SEO e mídia social para o Instagram.
Sua tarefa é sugerir uma lista de hashtags relevantes e eficazes para o tópico: "{{topic}}".

**Processo Obrigatório:**
1. Crie uma lista de hashtags. Combine hashtags populares com hashtags de nicho para maximizar o alcance.
2. Não inclua o caractere '#' na resposta.

Gere a lista de hashtags AGORA.`,
});

// Define o fluxo que utiliza o prompt.
const hashtagSuggesterFlow = ai.defineFlow(
  {
    name: 'hashtagSuggesterFlow',
    inputSchema: HashtagInputSchema,
    outputSchema: HashtagOutputSchema,
  },
  async input => {
    const { output } = await hashtagSuggester(input);
    return output!;
  }
);

/**
 * Função de invólucro (wrapper) que será chamada por outros agentes.
 * @param input O tópico para as hashtags.
 * @returns Uma lista de hashtags.
 */
export async function suggestHashtags(
  input: HashtagInput
): Promise<HashtagOutput> {
  return hashtagSuggesterFlow(input);
}
