'use server';

/**
 * @fileOverview Agente de IA especializado em sugerir hashtags para o Instagram.
 *
 * Este arquivo define um fluxo (flow) que usa uma ferramenta de busca para encontrar
 * termos relevantes e, em seguida, sugere uma lista de hashtags otimizadas.
 *
 * - suggestHashtags - A função que pode ser chamada por outros agentes.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleSearchTool } from '../tools/google-search-tool';

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

// Função de invólucro (wrapper) que será chamada por outros agentes.
export async function suggestHashtags(
  input: HashtagInput
): Promise<HashtagOutput> {
  return hashtagSuggesterFlow(input);
}


// Define o fluxo do agente que agora pode usar ferramentas.
export const hashtagSuggesterFlow = ai.defineFlow(
  {
    name: 'hashtagSuggesterFlow',
    inputSchema: HashtagInputSchema,
    outputSchema: HashtagOutputSchema,
  },
  async input => {
    // Define o prompt que será enviado ao modelo de IA.
    const prompt = `Você é um especialista em marketing de SEO e mídia social para o Instagram.
Sua tarefa é sugerir uma lista de hashtags relevantes e eficazes.

**Processo Obrigatório:**
1.  Analise o tópico: "${input.topic}".
2.  Use a ferramenta 'googleSearchTool' para pesquisar o tópico e identificar palavras-chave, nichos, comunidades ou termos populares relacionados.
3.  Com base nos resultados da busca, crie uma lista de hashtags. Combine hashtags populares com hashtags de nicho para maximizar o alcance.
4.  Não inclua o caractere '#' na resposta.

Gere a lista de hashtags AGORA, seguindo rigorosamente o processo.`;

    // Executa o modelo de IA, fornecendo a ferramenta de busca.
    const result = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
      tools: [googleSearchTool],
      output: {
        schema: HashtagOutputSchema,
      },
    });

    return result.output!;
  }
);
