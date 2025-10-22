'use server';
/**
 * @fileOverview A flow that generates an optimized prompt for image generation with Gemini Nano based on a user-provided image description.
 *
 * - generateGeminiNanoPrompt - A function that generates the prompt.
 * - GenerateGeminiNanoPromptInput - The input type for the generateGeminiNanoPrompt function.
 * - GenerateGeminiNanoPromptOutput - The return type for the generateGeminiNanoPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGeminiNanoPromptInputSchema = z.object({
  imageDescription: z
    .string()
    .describe('A description of the image to be generated.'),
  instagramTrends: z
    .string()
    .optional()
    .describe('Optional information on current Instagram trends.'),
});
export type GenerateGeminiNanoPromptInput = z.infer<
  typeof GenerateGeminiNanoPromptInputSchema
>;

const GenerateGeminiNanoPromptOutputSchema = z.object({
  prompt: z.string().describe('The optimized prompt for Gemini Nano.'),
});
export type GenerateGeminiNanoPromptOutput = z.infer<
  typeof GenerateGeminiNanoPromptOutputSchema
>;

export async function generateGeminiNanoPrompt(
  input: GenerateGeminiNanoPromptInput
): Promise<GenerateGeminiNanoPromptOutput> {
  return generateGeminiNanoPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGeminiNanoPromptPrompt',
  input: {schema: GenerateGeminiNanoPromptInputSchema},
  output: {schema: GenerateGeminiNanoPromptOutputSchema},
  prompt: `You are an expert prompt engineer for the Gemini Nano image generation model.

  Your goal is to create a highly effective prompt based on the user's description of the desired image.
  Consider current Instagram trends if provided to enhance the prompt's relevance and engagement potential.

  Image Description: {{{imageDescription}}}
  Instagram Trends (optional): {{{instagramTrends}}}

  Generate a concise and creative prompt that captures the essence of the description and is optimized for Gemini Nano. The prompt should not exceed 200 characters.
  `,
});

const generateGeminiNanoPromptFlow = ai.defineFlow(
  {
    name: 'generateGeminiNanoPromptFlow',
    inputSchema: GenerateGeminiNanoPromptInputSchema,
    outputSchema: GenerateGeminiNanoPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
