import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || 5000,
  geminiApiKey: process.env.GEMINI_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  tavilyApiKey: process.env.TAVILY_API_KEY,
};
