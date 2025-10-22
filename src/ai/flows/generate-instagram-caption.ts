'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating Instagram captions based on a user-provided post topic.
 *
 * - generateInstagramCaption - A function that generates an Instagram caption.
 * - GenerateInstagramCaptionInput - The input type for the generateInstagramCaption function.
 * - GenerateInstagramCaptionOutput - The return type for the generateInstagramCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInstagramCaptionInputSchema = z.object({
  postTopic: z
    .string()
    .describe('The topic of the post for which to generate a caption.'),
});

export type GenerateInstagramCaptionInput = z.infer<
  typeof GenerateInstagramCaptionInputSchema
>;

const GenerateInstagramCaptionOutputSchema = z.object({
  caption: z
    .string()
    .describe(
      'A relevant and engaging caption for the post, within Instagrams character limit.'
    ),
});

export type GenerateInstagramCaptionOutput = z.infer<
  typeof GenerateInstagramCaptionOutputSchema
>;

export async function generateInstagramCaption(
  input: GenerateInstagramCaptionInput
): Promise<GenerateInstagramCaptionOutput> {
  return generateInstagramCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInstagramCaptionPrompt',
  input: {schema: GenerateInstagramCaptionInputSchema},
  output: {schema: GenerateInstagramCaptionOutputSchema},
  prompt: `You are a social media marketing specialist for Instagram. Generate an engaging and relevant Instagram caption based on the following post topic. Keep the caption under Instagram's character limit.

Post Topic: {{{postTopic}}}`,
});

const generateInstagramCaptionFlow = ai.defineFlow(
  {
    name: 'generateInstagramCaptionFlow',
    inputSchema: GenerateInstagramCaptionInputSchema,
    outputSchema: GenerateInstagramCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
