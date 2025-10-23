'use server';
/**
 * @fileOverview Ferramenta de IA (agente) especializada em criar prompts para geração de imagem.
 *
 * Este arquivo define uma "ferramenta" que o agente principal pode usar.
 * Esta ferramenta recebe um tópico e retorna um prompt de imagem otimizado.
 *
 * - imagePromptGeneratorTool - A ferramenta que pode ser chamada por outros agentes.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema de entrada para a ferramenta: o tópico do post.
const ImagePromptInputSchema = z.object({
  topic: z
    .string()
    .describe('O tópico para o qual o prompt de imagem deve ser criado.'),
});

// Esquema de saída da ferramenta: o prompt de imagem gerado.
const ImagePromptOutputSchema = z.object({
  imagePrompt: z
    .string()
    .describe('O prompt de imagem otimizado para o tópico fornecido.'),
});

// Definimos a ferramenta usando `ai.defineTool`.
// Esta é a unidade de trabalho que nosso agente principal irá acionar.
export const imagePromptGeneratorTool = ai.defineTool(
  {
    name: 'imagePromptGenerator',
    description:
      'Gera um prompt de imagem otimizado para o Instagram com base em um tópico de postagem. Use esta ferramenta para obter um prompt criativo para a geração de imagens.',
    inputSchema: ImagePromptInputSchema,
    outputSchema: ImagePromptOutputSchema,
  },
  // A função assíncrona que executa a lógica da ferramenta.
  // Ela usa um prompt do Genkit para chamar o modelo de IA.
  async input => {
    // Define o prompt que será enviado ao modelo de IA.
    const prompt = `Você é um especialista em engenharia de prompts de imagem para o Instagram.
Sua tarefa é criar um prompt de imagem altamente eficaz com base no tópico do post do usuário.

Tópico do Post: ${input.topic}

Gere um prompt conciso e criativo que capture a essência do tópico e seja otimizado para criar um post visualmente atraente no Instagram. O prompt não deve exceder 200 caracteres.`;

    // Chama o modelo de IA com o prompt.
    const { text } = await ai.generate({
      prompt: prompt,
    });

    // Retorna o resultado no formato definido pelo `outputSchema`.
    return { imagePrompt: text() };
  }
);
