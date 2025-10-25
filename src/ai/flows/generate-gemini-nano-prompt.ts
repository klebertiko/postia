'use server';
/**
 * @fileOverview Agente orquestrador para criar prompts de imagem seguros.
 *
 * Este agente recebe um tópico e usa uma ferramenta de busca para verificar a segurança
 * de cada elemento antes de construir o prompt final para a geração de imagem.
 *
 * - generateImagePrompt - A função principal que inicia o processo.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleSearchTool } from '../tools/google-search-tool';

// Esquema de entrada: o tópico do post.
const ImagePromptInputSchema = z.object({
  topic: z
    .string()
    .describe('O tópico para o qual o prompt de imagem deve ser criado.'),
});
export type ImagePromptInput = z.infer<typeof ImagePromptInputSchema>;

// Esquema de saída: o prompt de imagem final e verificado.
const ImagePromptOutputSchema = z.object({
  imagePrompt: z
    .string()
    .describe(
      'O prompt de imagem otimizado e verificado para o tópico fornecido.'
    ),
});
export type ImagePromptOutput = z.infer<typeof ImagePromptOutputSchema>;

// Função de invólucro (wrapper) que será chamada por outros agentes.
export async function generateImagePrompt(
  input: ImagePromptInput
): Promise<ImagePromptOutput> {
  return imagePromptFlow(input);
}

// Define o fluxo do agente que agora pode usar ferramentas.
const imagePromptFlow = ai.defineFlow(
  {
    name: 'imagePromptGeneratorFlow',
    inputSchema: ImagePromptInputSchema,
    outputSchema: ImagePromptOutputSchema,
  },
  async input => {
    // Define o prompt para o agente de prompt.
    // Ele agora tem a responsabilidade de usar a ferramenta de busca.
    const prompt = `Você é um Engenheiro de Prompt Sênior e um especialista em pesquisa de segurança.
Sua tarefa é criar um prompt de imagem detalhado e seguro em português do Brasil.

**Processo Obrigatório:**
1.  Analise o tópico: "${input.topic}".
2.  Identifique categorias de risco (ex: animais, alimentos, plantas, crianças).
3.  Para CADA elemento que você pretende incluir nessas categorias, você DEVE USAR a ferramenta 'googleSearchTool' para fazer uma pergunta específica sobre sua segurança. Exemplo de pergunta: "pimentão é seguro para porquinhos-da-índia?".
4.  Construa uma lista de elementos POSITIVOS E COMPROVADAMENTE SEGUROS com base nas respostas da busca.
5.  Se a busca for inconclusiva ou indicar perigo sobre um item, NÃO o inclua.
6.  Formule o prompt final seguindo a estrutura detalhada abaixo, usando apenas os itens verificados.

**Estrutura do Prompt de Saída:**
O prompt final deve ser uma única linha de texto em português do Brasil, separando os conceitos por vírgulas.
1.  **Assunto Principal:** A cena central.
2.  **Estilo e Atmosfera:** Estilo (foto realista, cinematográfico) e atmosfera (acolhedor, vibrante).
3.  **Iluminação:** Detalhe a iluminação.
4.  **Cores e Paleta:** Sugira uma paleta de cores.
5.  **Composição:** Indique o enquadramento.
6.  **Detalhes Adicionais (Verificados):** Adicione os elementos específicos e comprovadamente seguros.
7.  **Negativos:** Liste de forma geral os elementos a serem evitados para garantir a segurança (ex: evitar alimentos tóxicos, objetos cortantes).

Gere o prompt final AGORA, seguindo rigorosamente o processo de verificação.`;

    // Executa o modelo de IA, fornecendo a ferramenta de busca.
    const result = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash', // Usar um modelo capaz de tool use
      tools: [googleSearchTool],
      output: {
        schema: ImagePromptOutputSchema,
      },
    });

    return result.output!;
  }
);
