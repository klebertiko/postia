import { config } from 'dotenv';
config();

// Importamos o novo fluxo do agente principal.
// Os outros fluxos não precisam mais ser importados aqui pois são usados como ferramentas.
import '@/ai/flows/content-agent-flow.ts';
