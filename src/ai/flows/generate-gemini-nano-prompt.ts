'use server';
/**
 * @fileOverview A flow that generates an optimized prompt for image generation based on a user-provided post topic.
 *
 * - generateGeminiNanoPrompt - A function that generates the prompt.
 * - GenerateGeminiNanoPromptInput - The input type for the generateGeminiNanoPrompt function.
 * - GenerateGeminiNanoPromptOutput - The return type for the generateGeminiNanoPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGeminiNanoPromptInputSchema = z.object({
  postTopic: z
    .string()
    .describe('The topic of the post for which to generate an image prompt.'),
});
export type GenerateGeminiNanoPromptInput = z.infer<
  typeof GenerateGeminiNanoPromptInputSchema
>;

const GenerateGeminiNanoPromptOutputSchema = z.object({
  prompt: z
    .string()
    .describe('The optimized prompt for image generation.'),
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
  prompt: `You are an expert in image prompt engineering for Instagram.

  Your goal is to create a highly effective prompt for image generation based on the user's post topic.

  Post Topic: {{{postTopic}}}

  Generate a concise and creative prompt that captures the essence of the topic and is optimized for creating a visually appealing Instagram post. The prompt should not exceed 200 characters.
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
