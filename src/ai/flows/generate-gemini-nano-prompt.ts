'use server';
/**
 * @fileOverview Um fluxo que gera um prompt otimizado para geração de imagem com base em um tópico de postagem fornecido pelo usuário.
 *
 * - generateGeminiNanoPrompt - Uma função que gera o prompt.
 * - GenerateGeminiNanoPromptInput - O tipo de entrada para a função generateGeminiNanoPrompt.
 * - GenerateGeminiNanoPromptOutput - O tipo de retorno para a função generateGeminiNanoPrompt.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGeminiNanoPromptInputSchema = z.object({
  postTopic: z
    .string()
    .describe('O tópico do post para o qual gerar um prompt de imagem.'),
});
export type GenerateGeminiNanoPromptInput = z.infer<
  typeof GenerateGeminiNanoPromptInputSchema
>;

const GenerateGeminiNanoPromptOutputSchema = z.object({
  prompt: z
    .string()
    .describe('O prompt otimizado para geração de imagem.'),
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
  prompt: `Você é um especialista em engenharia de prompts de imagem para o Instagram.

  Seu objetivo é criar um prompt altamente eficaz para a geração de imagens com base no tópico do post do usuário.

  Tópico do Post: {{{postTopic}}}

  Gere um prompt conciso e criativo que capture a essência do tópico e seja otimizado para criar um post visualmente atraente no Instagram. O prompt não deve exceder 200 caracteres.
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
