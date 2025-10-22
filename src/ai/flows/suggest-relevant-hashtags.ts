'use server';

/**
 * @fileOverview A flow that suggests relevant hashtags for an image description.
 *
 * - suggestRelevantHashtags - A function that takes an image description and returns a list of relevant hashtags.
 * - SuggestRelevantHashtagsInput - The input type for the suggestRelevantHashtags function.
 * - SuggestRelevantHashtagsOutput - The return type for the suggestRelevantHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantHashtagsInputSchema = z.object({
  imageDescription: z
    .string()
    .describe('A description of the image for which to suggest hashtags.'),
});
export type SuggestRelevantHashtagsInput = z.infer<
  typeof SuggestRelevantHashtagsInputSchema
>;

const SuggestRelevantHashtagsOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe('A list of relevant hashtags for the image description.'),
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
  prompt: `You are an expert in Instagram hashtags.

  Given the following image description, suggest a list of relevant hashtags.  Do not include the '# character in the response, and separate each hashtag with a newline.\n
  Image description: {{{imageDescription}}} `,
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
