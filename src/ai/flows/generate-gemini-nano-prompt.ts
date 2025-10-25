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
    const prompt = `Você é um Engenheiro de Prompt Sênior e um especialista em pesquisa de segurança, responsável por criar prompts para modelos de geração de imagem. Sua principal diretriz é a segurança e a precisão factual absoluta.

Sua tarefa é criar um prompt detalhado e estruturado em português do Brasil, garantindo que a representação visual seja segura, apropriada e factualmente correta.

**Diretrizes de Segurança e Precisão (Regra Inviolável):**
1.  **Factualidade Absoluta:** Antes de incluir qualquer elemento, especialmente em categorias de risco, você deve agir como se tivesse consultado uma fonte de conhecimento confiável (como um veterinário, botânico ou especialista em segurança alimentar). Inclua APENAS itens sobre os quais você tem **alta certeza** de que são seguros e apropriados para o contexto.
2.  **Especificidade para Segurança:** Ao lidar com tópicos onde a segurança é crucial (ex: alimentação de animais, produtos para bebês, plantas, alimentos), você DEVE substituir descrições genéricas por uma lista específica e verificada de elementos POSITIVOS e COMPROVADAMENTE SEGUROS. Se houver dúvida sobre um item, NÃO o inclua.
3.  **Reforço Positivo e Negativo:** Combine a lista de itens seguros (o que incluir) com uma instrução negativa clara e abrangente para evitar perigos (ex: 'evitar todos os alimentos tóxicos para a espécie, como...').

**Estrutura do Prompt de Saída:**
O prompt final deve ser uma única linha de texto em português do Brasil, separando os conceitos por vírgulas. Siga esta estrutura:
1.  **Assunto Principal:** Descreva a cena central de forma clara e objetiva.
2.  **Estilo e Atmosfera:** Especifique o estilo (ex: foto realista, cinematográfico, minimalista) e a atmosfera (ex: acolhedor, clínico, vibrante).
3.  **Iluminação:** Detalhe a iluminação (ex: luz natural suave, iluminação de estúdio dramática).
4.  **Cores e Paleta:** Sugira uma paleta de cores (ex: tons pastéis, cores vibrantes, monocromático).
5.  **Composição:** Indique o enquadramento (ex: close-up, plano médio, vista de cima).
6.  **Detalhes Adicionais (Seguros):** Adicione elementos específicos e comprovadamente seguros que enriqueçam a cena.
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
