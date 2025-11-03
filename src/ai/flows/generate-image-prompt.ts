'use server';
/**
 * @fileOverview Agente para criar prompts de imagem seguros.
 *
 * Este agente recebe um tópico e cria um prompt detalhado para um modelo de geração de imagem.
 *
 * - generateImagePrompt - A função principal que inicia o processo.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema de entrada: o tópico do post.
const ImagePromptInputSchema = z.object({
  topic: z
    .string()
    .describe('O tópico para o qual o prompt de imagem deve ser criado.'),
});
export type ImagePromptInput = z.infer<typeof ImagePromptInputSchema>;

// Esquema de saída: o prompt de imagem final.
const ImagePromptOutputSchema = z.object({
  imagePrompt: z
    .string()
    .describe(
      'O prompt de imagem otimizado para o tópico fornecido.'
    ),
});
export type ImagePromptOutput = z.infer<typeof ImagePromptOutputSchema>;

// Define o prompt reutilizável para o agente de prompt de imagem.
const imagePromptGenerator = ai.definePrompt({
  name: 'imagePromptGenerator',
  input: { schema: ImagePromptInputSchema },
  output: { schema: ImagePromptOutputSchema },
  prompt: `Você é um Engenheiro de Prompt Sênior.
Sua tarefa é criar um prompt de imagem detalhado e seguro em português do Brasil para o tópico: "{{topic}}".

**Requisitos Obrigatórios:**
1.  **Segurança e Apropriação:** Garanta que todos os elementos visuais sejam seguros, apropriados e factualmente corretos para o contexto.
2.  **Listas Positivas:** Para categorias de risco (ex: comida para animais de estimação, acessórios para bebês), substitua descrições genéricas por uma lista específica e verificada de elementos POSITIVOS e SEGUROS.
3.  **Reforço Negativo:** Complemente a lista positiva com uma instrução negativa geral (ex: "evitar alimentos não seguros", "sem objetos cortantes").

**Estrutura do Prompt de Saída:**
Formule o prompt como uma única linha de texto em português do Brasil, separando conceitos por vírgulas, seguindo esta ordem:
1.  **Assunto Principal:** A cena central.
2.  **Estilo e Atmosfera:** Estilo (foto realista, cinematográfico) e atmosfera (acolhedor, vibrante).
3.  **Iluminação:** Detalhe a iluminação.
4.  **Cores e Paleta:** Sugira uma paleta de cores.
5.  **Composição:** Indique o enquadramento.
6.  **Detalhes Adicionais (Verificados):** Adicione os elementos específicos e comprovadamente seguros.
7.  **Negativos:** Liste de forma geral os elementos a serem evitados para garantir a segurança.

Gere o prompt final AGORA.`,
});

// Define o fluxo que utiliza o prompt.
const imagePromptFlow = ai.defineFlow(
  {
    name: 'imagePromptGeneratorFlow',
    inputSchema: ImagePromptInputSchema,
    outputSchema: ImagePromptOutputSchema,
  },
  async input => {
    const { output } = await imagePromptGenerator(input);
    return output!;
  }
);

/**
 * Função de invólucro (wrapper) que será chamada por outros agentes.
 * @param input O tópico para o prompt de imagem.
 * @returns O prompt de imagem gerado.
 */
export async function generateImagePrompt(
  input: ImagePromptInput
): Promise<ImagePromptOutput> {
  return imagePromptFlow(input);
}
