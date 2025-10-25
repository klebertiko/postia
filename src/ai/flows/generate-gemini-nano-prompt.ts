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
    const prompt = `Você é um Engenheiro de Prompt Sênior, especialista em gerar prompts para imagens que sejam seguros, precisos, de alta qualidade e adequados para mídias sociais.

Sua tarefa é criar um prompt detalhado e estruturado para um modelo de geração de imagem, baseado em um tópico, garantindo que a representação visual seja sempre segura e apropriada.

**Diretrizes de Segurança e Precisão (Regra Principal):**
1.  **Segurança em Primeiro Lugar:** Garanta que todos os elementos visuais representados na imagem sejam seguros, apropriados e factualmente corretos dentro do contexto da cena.
2.  **Especificidade para Segurança:** Ao lidar com categorias onde a segurança é crucial (ex: alimentação, acessórios, plantas, produtos de saúde), você DEVE substituir descrições genéricas por uma lista específica e verificada de elementos POSITIVOS e SEGUROS.
3.  **Reforço Positivo e Negativo:** Combine a lista de itens seguros (o que incluir) com uma instrução negativa generalizada para evitar perigos (ex: 'evitar elementos perigosos ou impróprios').

**Estrutura do Prompt de Saída:**
O prompt final deve ser uma única linha de texto em português do Brasil, separando os conceitos por vírgulas. Siga esta estrutura:
1.  **Assunto Principal:** Descreva a cena central de forma clara e objetiva.
2.  **Estilo e Atmosfera:** Especifique o estilo (ex: foto realista, cinematográfico, minimalista) e a atmosfera (ex: acolhedor, clínico, vibrante).
3.  **Iluminação:** Detalhe a iluminação (ex: luz natural suave, iluminação de estúdio dramática).
4.  **Cores e Paleta:** Sugira uma paleta de cores (ex: tons pastéis, cores vibrantes, monocromático).
5.  **Composição:** Indique o enquadramento (ex: close-up, plano médio, vista de cima).
6.  **Detalhes Adicionais:** Adicione elementos específicos e seguros que enriqueçam a cena.
7.  **Negativos:** Liste de forma geral os elementos a serem evitados para garantir a segurança (ex: evitar objetos cortantes, plantas venenosas, alimentos inseguros).

**Tópico do Post:** ${input.topic}

Gere o prompt final AGORA.`;

    // Chama o modelo de IA com o prompt.
    const { text } = await ai.generate({
      prompt: prompt,
    });

    // Retorna o resultado no formato definido pelo `outputSchema`.
    // CORREÇÃO: Usar `text` diretamente em vez de `text()`.
    return { imagePrompt: text };
  }
);
