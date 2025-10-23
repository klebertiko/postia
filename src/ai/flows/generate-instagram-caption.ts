'use server';

/**
 * @fileOverview Este arquivo define um fluxo Genkit para gerar legendas do Instagram com base em um tópico de postagem fornecido pelo usuário.
 *
 * - generateInstagramCaption - Uma função que gera uma legenda para o Instagram.
 * - GenerateInstagramCaptionInput - O tipo de entrada para a função generateInstagramCaption.
 * - GenerateInstagramCaptionOutput - O tipo de retorno da função generateInstagramCaption.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInstagramCaptionInputSchema = z.object({
  postTopic: z
    .string()
    .describe('O tópico do post para o qual gerar uma legenda.'),
});

export type GenerateInstagramCaptionInput = z.infer<
  typeof GenerateInstagramCaptionInputSchema
>;

const GenerateInstagramCaptionOutputSchema = z.object({
  caption: z
    .string()
    .describe(
      'Uma legenda relevante e envolvente para o post, dentro do limite de caracteres do Instagram.'
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
  prompt: `Você é um especialista em marketing de mídia social para o Instagram. Gere uma legenda envolvente e relevante para o Instagram com base no seguinte tópico de postagem. Mantenha a legenda abaixo do limite de caracteres do Instagram.

Tópico da postagem: {{{postTopic}}}`,
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
