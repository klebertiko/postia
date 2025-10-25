'use server';
/**
 * @fileOverview Ferramenta de busca na web.
 *
 * Este arquivo define uma "ferramenta" Genkit que simula uma busca no Google.
 * Agentes de IA podem usar esta ferramenta para verificar fatos ou obter informações em tempo real.
 *
 * - googleSearchTool - A ferramenta que pode ser chamada por outros agentes.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema de entrada para a ferramenta: a query de busca.
const SearchInputSchema = z.object({
  query: z.string().describe('A pergunta ou termo a ser pesquisado na web.'),
});

// Esquema de saída da ferramenta: um resumo da resposta encontrada.
const SearchOutputSchema = z.string().describe('Um resumo conciso dos resultados da busca.');

// Definimos a ferramenta de busca usando `ai.defineTool`.
export const googleSearchTool = ai.defineTool(
  {
    name: 'googleSearchTool',
    description: 'Realiza uma busca na web para responder a uma pergunta ou verificar um fato. Use para obter informações atualizadas e precisas.',
    inputSchema: SearchInputSchema,
    outputSchema: SearchOutputSchema,
  },
  // A função que executa a lógica da ferramenta.
  // Em um projeto real, aqui seria feita uma chamada a uma API de busca (ex: Google Custom Search JSON API).
  // Por enquanto, vamos simular a resposta para fins de demonstração.
  async (input) => {
    console.log(`🔎 Realizando busca simulada por: "${input.query}"`);

    // **Simulação de Respostas da API de Busca**
    // Para um sistema real, você substituiria esta lógica por uma chamada de API real.
    const query = input.query.toLowerCase();
    if (query.includes('alface romana') && query.includes('porquinho da índia')) {
      return "Não, alface romana não é segura para porquinhos-da-índia. Ela pode causar diarreia e desidratação. Outras alfaces, como a americana, também devem ser evitadas. Alimentos seguros incluem feno, pimentão e cenoura.";
    }
    if (query.includes('pimentão') && query.includes('porquinho da índia')) {
      return "Sim, pimentão (vermelho, verde, amarelo) é um alimento excelente e seguro para porquinhos-da-índia, pois é rico em vitamina C.";
    }
    if (query.includes('cenoura') && query.includes('porquinho da índia')) {
        return "Sim, cenouras são seguras para porquinhos-da-índia com moderação, pois contêm açúcar. Tanto a raiz quanto as folhas são comestíveis para eles.";
    }

    // Resposta genérica para outras buscas
    return `Resultado da busca para "${input.query}": (Esta é uma resposta simulada. Para uma implementação real, conecte a uma API de busca).`;
  }
);
