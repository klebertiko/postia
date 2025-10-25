'use server';
import { config } from 'dotenv';
config();

// Importamos os fluxos e ferramentas.
// Todos os agentes agora são fluxos que podem usar a ferramenta de busca.
import '@/ai/flows/content-agent-flow';
import '@/ai/flows/generate-gemini-nano-prompt';
import '@/ai/flows/generate-instagram-caption';
import '@/ai/flows/suggest-relevant-hashtags';
