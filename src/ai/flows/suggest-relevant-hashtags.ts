'use server';

/**
 * @fileOverview Um fluxo que sugere hashtags relevantes para um tópico de postagem.
 *
 * - suggestRelevantHashtags - Uma função que recebe um tópico de postagem e retorna uma lista de hashtags relevantes.
 * - SuggestRelevantHashtagsInput - O tipo de entrada para a função suggestRelevantHashtags.
 * - SuggestRelevantHashtagsOutput - O tipo de retorno da função suggestRelevantHashtags.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantHashtagsInputSchema = z.object({
  postTopic: z
    .string()
    .describe('O tópico do post para o qual sugerir hashtags.'),
});
export type SuggestRelevantHashtagsInput = z.infer<
  typeof SuggestRelevantHashtagsInputSchema
>;

const SuggestRelevantHashtagsOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe('Uma lista de hashtags relevantes para o tópico da postagem.'),
});
export type SuggestRelevantHashtagsOutput = z.infer<
  typeof SuggestRelevantHashtagsOutputSchema
>;

export async function suggestRelevantHashtags(
  input: SuggestRelevantHashtagsInput
): Promise<SuggestRelevantHashtagsOutput> {
  return suggestRelevantHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantHashtagsPrompt',
  input: {schema: SuggestRelevantHashtagsInputSchema},
  output: {schema: SuggestRelevantHashtagsOutputSchema},
  prompt: `Você é um especialista em marketing de mídia social para o Instagram.

  Dado o seguinte tópico de postagem, sugira uma lista de hashtags relevantes. Não inclua o caractere '#' na resposta.
  
  Tópico da postagem: {{{postTopic}}}`,
});

const suggestRelevantHashtagsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantHashtagsFlow',
    inputSchema: SuggestRelevantHashtagsInputSchema,
    outputSchema: SuggestRelevantHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
