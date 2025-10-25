import { config } from 'dotenv';
config();

// Importamos os fluxos e ferramentas.
// O content-agent-flow foi simplificado, e os outros são suas dependências.
import '@/ai/flows/content-agent-flow';
import '@/ai/flows/generate-gemini-nano-prompt';
import '@/ai/flows/generate-instagram-caption';
import '@/ai/flows/suggest-relevant-hashtags';
import '@/ai/tools/google-search-tool';
