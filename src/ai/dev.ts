import { config } from 'dotenv';
config();

import '@/ai/flows/generate-gemini-nano-prompt.ts';
import '@/ai/flows/generate-instagram-caption.ts';
import '@/ai/flows/suggest-relevant-hashtags.ts';