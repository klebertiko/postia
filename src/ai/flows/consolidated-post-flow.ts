'use server';

/**
 * @fileOverview Fluxo consolidado para gerar legenda, hashtags e imagem em uma única chamada.
 * Otimizado para economizar requests e aproveitar os limites do modelo gemini-2.5-flash.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema de entrada: o tópico do post.
const ConsolidatedInputSchema = z.object({
    topic: z.string().describe('O tópico do post do Instagram.'),
});

// Esquema de saída: legenda, hashtags e imagem.
const ConsolidatedOutputSchema = z.object({
    caption: z.string().describe('A legenda envolvente para o post.'),
    hashtags: z.array(z.string()).describe('Lista de hashtags relevantes.'),
    imagePrompt: z.string().describe('O prompt usado para gerar a imagem.'),
    imageUrl: z.string().optional().describe('Dados da imagem gerada (base64)'),
});

export type ConsolidatedInput = z.infer<typeof ConsolidatedInputSchema>;
export type ConsolidatedOutput = z.infer<typeof ConsolidatedOutputSchema>;

/**
 * Flow que gera todo o conteúdo do post em uma única chamada de IA.
 * Utiliza o modelo gemini-2.5-flash configurado no Genkit.
 */
export const consolidatedPostFlow = ai.defineFlow(
    {
        name: 'consolidatedPostFlow',
        inputSchema: ConsolidatedInputSchema,
        outputSchema: ConsolidatedOutputSchema,
    },
    async (input: ConsolidatedInput) => {
        // Definimos o prompt para gerar tanto o texto estruturado quanto a imagem.
        // O modelo gemini-2.5-flash-image deve ser capaz de retornar media parts.
        const { output, response } = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            input: `Gere um conteúdo completo para um post de Instagram sobre o tópico: "${input.topic}".
      
      Você deve retornar:
      1. Uma legenda (caption) envolvente e sem hashtags, terminando com um CTA.
      2. Uma lista de 10 a 15 hashtags relevantes.
      3. Um prompt detalhado que descreva uma imagem ideal para este post.
      4. GERE TAMBÉM A IMAGEM REAL correspondente a este tópico.
      
      Retorne o texto no formato JSON estruturado.`,
            output: {
                schema: ConsolidatedOutputSchema,
            },
        });

        if (!output) {
            throw new Error('Falha ao gerar conteúdo consolidado.');
        }

        // Tenta extrair a imagem da resposta se o modelo gerou algo multimodal.
        // Dependendo de como o Genkit lida com o Gemini gerando imagens,
        // podemos precisar procurar por partes de mídia na resposta.
        let generatedImageUrl = '';
        if (response && response.message && response.message.content) {
            const imagePart = response.message.content.find((part: any) => part.media);
            if (imagePart && imagePart.media) {
                generatedImageUrl = `data:${imagePart.media.contentType};base64,${imagePart.media.url}`;
            }
        }

        return {
            ...output,
            imageUrl: generatedImageUrl || output.imageUrl,
        };
    }
);

/**
 * Função de conveniência para chamar o fluxo.
 */
export async function generateConsolidatedContent(input: ConsolidatedInput): Promise<ConsolidatedOutput> {
    return consolidatedPostFlow(input);
}
