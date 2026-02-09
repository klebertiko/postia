/**
 * Representa a estrutura de dados para o conteúdo gerado pela IA.
 */
export type GeneratedContent = {
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  imageUrl?: string; // Base64 string from Gemini
};

/**
 * Representa um único gerador de imagem com seu nome e URL.
 */
export type ImageGenerator = {
  name: string;
  url: string;
};
