import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { researchAgentGraph } from './agent/graph.js';
import { getMockReport } from './tools/mockData.js';
import { verifyCompanyExists } from './tools/validation.js';

const app = express();

// Enable CORS for all origins (useful in local dev settings)
app.use(cors());
app.use(express.json());

/**
 * Helper to detect gibberish or invalid company names (e.g. "ygyhg", "zxcvb")
 */
function isLikelyGibberish(name) {
  const clean = name.trim().toLowerCase();

  // 1. Length check: must be at least 2 chars
  if (clean.length < 2) return true;

  // 2. Special characters or numbers only
  if (/^[0-9_\W]+$/.test(clean)) return true;

  // 3. Known valid entities list (always bypasses standard vowel checks)
  const whitelist = [
    'apple', 'tesla', 'nvidia', 'stripe', 'google', 'microsoft', 'amazon', 'meta',
    'netflix', 'spacex', 'openai', 'anthropic', 'aapl', 'tsla', 'nvda', 'goog',
    'msft', 'amzn', 'nflx', 'byd', 'htc', 'dhl', 'bmw', 'jbl', 'kfc', 'hsbc'
  ];
  if (whitelist.some(w => clean.includes(w))) {
    return false;
  }

  // 4. Repeated character clusters (e.g., zzzzz, aaaa, etc.)
  if (/(.)\1{3,}/.test(clean)) return true;

  // 5. Pattern-based vowel check (must contain at least one vowel including y)
  const hasVowels = /[aeiouy]/i.test(clean);
  if (clean.length >= 4 && !hasVowels) return true;

  // 6. Keyboard swipes check (e.g., asdfg, qwerty, zxcvb)
  const swipes = ['asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl', 'qwer', 'wert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop', 'zxcv', 'xcvb', 'cvbn', 'vbnm'];
  if (swipes.some(s => clean.includes(s))) return true;

  // 7. Check for lack of standard vowels (a, e, i, o, u) for lowercase random sequences
  const hasStandardVowels = /[aeiou]/i.test(clean);
  if (clean.length >= 4 && !hasStandardVowels) {
    // If it was typed in all-lowercase and has no standard vowels, treat as gibberish
    if (clean === name.trim()) return true;
  }

  return false;
}

/**
 * Main research execution endpoint
 */
app.post('/api/research', async (req, res) => {
  const { companyName } = req.body;

  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    return res.status(400).json({ error: "Company name is required and must be a valid string." });
  }

  const query = companyName.trim();

  if (isLikelyGibberish(query)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid company name',
      message: `"${query}" does not appear to be a valid company name. Please enter a well-known public company or check the spelling.`
    });
  }

  try {
    const verification = await verifyCompanyExists(query);

    if (!verification.found) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
        message: 'No reliable information could be found for this company. Please check the spelling or try another company.',
        companyName: query
      });
    }

    const hasKeys = !!(config.geminiApiKey || config.openaiApiKey);
    if (!hasKeys) {
      console.log(`[DEMO MODE] Company validated for "${query}". Returning mock report without invoking the LLM.`);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const report = getMockReport(query);
      return res.status(200).json({
        success: true,
        companyName: query,
        verification,
        ...report,
        demoMode: true
      });
    }

    console.log(`[LIVE MODE] Company validated for "${query}". Invoking LangGraph agent.`);
    const finalState = await researchAgentGraph.invoke({
      companyName: query,
      logs: []
    });

    return res.status(200).json({
      success: true,
      companyName: finalState.companyName,
      ticker: finalState.ticker,
      tickerInfo: finalState.tickerInfo,
      financials: finalState.financials,
      searchResults: finalState.searchResults,
      newsResults: finalState.newsResults,
      analysis: finalState.analysis,
      decision: finalState.decision,
      logs: finalState.logs,
      verification,
      demoMode: false
    });
  } catch (error) {
    console.error(`[ERROR] Research request failed for "${query}":`, error);

    const isValidationError = error.message && error.message.toLowerCase().includes('company name is required');
    if (isValidationError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Company name is required and must be a valid string. Please update your request and retry.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request. Please try again later.',
      details: error.message
    });
  }
});

/**
 * Server status/health endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: (config.geminiApiKey || config.openaiApiKey) ? 'live' : 'demo',
    hasGemini: !!config.geminiApiKey,
    hasOpenAI: !!config.openaiApiKey,
    hasTavily: !!config.tavilyApiKey
  });
});

app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`AI Investment Agent Server running on port ${config.port}`);
  console.log(`Mode: ${(config.geminiApiKey || config.openaiApiKey) ? 'LIVE' : 'DEMO/PREVIEW'}`);
  console.log(`Gemini Key Configured: ${!!config.geminiApiKey}`);
  console.log(`OpenAI Key Configured: ${!!config.openaiApiKey}`);
  console.log(`Tavily Key Configured: ${!!config.tavilyApiKey}`);
  console.log(`=========================================`);
});
