import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { config } from "../config.js";

// List of Gemini models to try in order of preference.
// This list will self-optimize at runtime by promoting the successful model to index 0.
let GEMINI_MODEL_CHAIN = [
  "gemini-flash-latest", // Promoted to first since it is verified working on this key
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-pro-latest",
];

/**
 * Creates a Gemini LLM instance for the given model name.
 */
function createGeminiLLM(modelName) {
  return new ChatGoogleGenerativeAI({
    apiKey: config.geminiApiKey,
    modelName,
    temperature: 0.2,
    maxOutputTokens: 4096,
    maxRetries: 0, // Disable automatic retries to allow instant failover
  });
}

/**
 * Invokes a prompt with automatic Gemini model failover.
 * Tries each model in GEMINI_MODEL_CHAIN until one succeeds.
 * @param {string} prompt - The prompt text to send.
 * @returns {Promise<string>} - The LLM response content.
 */
export async function invokeLLM(prompt) {
  if (config.geminiApiKey) {
    let lastError = null;
    
    // Copy the chain to prevent concurrent mutation issues
    const currentChain = [...GEMINI_MODEL_CHAIN];
    
    for (const modelName of currentChain) {
      try {
        const llm = createGeminiLLM(modelName);
        const response = await llm.invoke(prompt);
        
        // Dynamic promotion: if a model succeeds, move it to the front of the chain
        const idx = GEMINI_MODEL_CHAIN.indexOf(modelName);
        if (idx > 0) {
          console.log(`[LLM] Promoting successful model ${modelName} to the front of the chain.`);
          GEMINI_MODEL_CHAIN.splice(idx, 1);
          GEMINI_MODEL_CHAIN.unshift(modelName);
        }
        
        console.log(`[LLM] Success with model: ${modelName}`);
        return response.content;
      } catch (error) {
        lastError = error;
        const errMsg = error.message?.toLowerCase() || '';
        const isQuota = errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('rate limit');
        const isNotFound = errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('not_found');
        if (isQuota || isNotFound) {
          console.warn(`[LLM] Model ${modelName} unavailable (${isQuota ? 'quota' : '404'}). Trying next...`);
          continue;
        }
        // For other errors (e.g. invalid key), stop trying
        throw error;
      }
    }
    throw lastError || new Error("All Gemini models exhausted quota.");
  } else if (config.openaiApiKey) {
    const llm = new ChatOpenAI({
      apiKey: config.openaiApiKey,
      modelName: "gpt-4o-mini",
      temperature: 0.2,
      maxRetries: 1,
    });
    const response = await llm.invoke(prompt);
    return response.content;
  } else {
    throw new Error(
      "Missing LLM API keys. Please set GEMINI_API_KEY or OPENAI_API_KEY in your backend/.env file."
    );
  }
}
