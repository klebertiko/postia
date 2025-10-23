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
    const prompt = `Você é um Engenheiro de Prompt Sênior especialista em gerar imagens para mídias sociais.
Sua tarefa é criar um prompt detalhado e estruturado para o modelo de imagem, baseado em um tópico.
O prompt deve ser otimizado para criar uma imagem visualmente impactante, profissional e adequada para o Instagram.

Estruture sua resposta seguindo as diretrizes abaixo:
1.  **Assunto Principal:** Descreva a cena central de forma clara e objetiva.
2.  **Estilo e Atmosfera:** Especifique o estilo (ex: foto realista, cinematográfico, minimalista) e a atmosfera (ex: acolhedor, clínico, vibrante).
3.  **Iluminação:** Detalhe a iluminação (ex: luz natural suave, iluminação de estúdio dramática).
4.  **Cores e Paleta:** Sugira uma paleta de cores (ex: tons pastéis, cores vibrantes, monocromático).
5.  **Composição:** Indique o enquadramento (ex: close-up, plano médio, vista de cima).
6.  **Detalhes Adicionais:** Adicione elementos que enriqueçam a cena, se aplicável.
7.  **Negativos:** (Opcional) Liste elementos a serem evitados.

**Tópico do Post:** ${input.topic}

Gere o prompt final em uma única linha de texto, separando os conceitos por vírgulas.`;

    // Chama o modelo de IA com o prompt.
    const { text } = await ai.generate({
      prompt: prompt,
    });

    // Retorna o resultado no formato definido pelo `outputSchema`.
    // CORREÇÃO: Usar `text` diretamente em vez de `text()`.
    return { imagePrompt: text };
  }
);
