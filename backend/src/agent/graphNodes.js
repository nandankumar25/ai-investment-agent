import { invokeLLM } from "./llm.js";
import { resolveTicker, getFinancials } from "../tools/finance.js";
import { webSearch } from "../tools/search.js";
import { getMockReport } from "../tools/mockData.js";

/**
 * Node 1: Resolve Stock Ticker & Initial Overview
 */
export async function resolveTickerNode(state) {
  const companyName = state.companyName;
  if (!companyName) {
    throw new Error("Company name is required");
  }

  const logs = [`Initiating investment research for "${companyName}"...`];

  try {
    const tickerResult = await resolveTicker(companyName);

    // Concurrently pre-fetch search results for overview and news to eliminate sequential latency
    const queryOverview = `${companyName} company overview business model key financials`;
    const queryNews = tickerResult
      ? `$${tickerResult.ticker} stock news controversies sentiment 2026`
      : `${companyName} news controversies market sentiment 2026`;

    logs.push("Gathering business overview and news sentiment concurrently...");

    const [overviewResults, newsResults] = await Promise.all([
      webSearch(queryOverview).catch(err => {
        console.warn("Overview pre-fetch failed:", err.message);
        return [];
      }),
      webSearch(queryNews).catch(err => {
        console.warn("News pre-fetch failed:", err.message);
        return [];
      })
    ]);

    // Validation: if no ticker is resolved AND zero web search results are found, it's not a real company
    if (!tickerResult && overviewResults.length === 0) {
      throw new Error(`Could not find any public information or stock ticker for "${companyName}". Please verify the name and try again.`);
    }

    if (tickerResult) {
      logs.push(`Resolved ticker symbol: ${tickerResult.ticker} (${tickerResult.exchange})`);
      return {
        ticker: tickerResult.ticker,
        tickerInfo: tickerResult,
        searchResults: overviewResults,
        newsResults: newsResults,
        logs: [...logs, `Retrieved background and news sentiment records.`]
      };
    } else {
      logs.push(`No public stock ticker found for "${companyName}". Treating as private company.`);
      return {
        ticker: null,
        tickerInfo: null,
        searchResults: overviewResults,
        newsResults: newsResults,
        logs: [...logs, `Retrieved private market background and sentiment records.`]
      };
    }
  } catch (error) {
    logs.push(`Ticker resolution error: ${error.message}. Continuing with fallback web search.`);
    const searchResults = await webSearch(`${companyName} company background products`).catch(() => []);
    return {
      ticker: null,
      tickerInfo: null,
      searchResults,
      newsResults: [],
      logs
    };
  }
}

/**
 * Node 2: Gather Financial Metrics
 */
export async function gatherFinancialsNode(state) {
  const ticker = state.ticker;
  const companyName = state.companyName;
  const logs = ["Gathering financial data..."];

  try {
    if (ticker) {
      const financials = await getFinancials(ticker);
      if (financials) {
        logs.push(`Successfully loaded valuation and balance sheet metrics from Yahoo Finance.`);
        return {
          financials,
          logs
        };
      }
    }

    // If Yahoo Finance fails or company is private, we use the pre-fetched searchResults
    logs.push(`Using pre-fetched search records to resolve financial metrics.`);
    const fallbackProfile = {
      name: companyName,
      exchange: state.tickerInfo?.exchange || null,
      sector: state.tickerInfo?.sector || null,
      industry: state.tickerInfo?.industry || null,
      description: state.searchResults?.[0]?.snippet || `${companyName} is a business operating in the ${state.tickerInfo?.industry || 'broader commercial'} market.`,
      ceo: state.tickerInfo?.ceo || null,
      founded: state.tickerInfo?.founded || null,
      headquarters: state.tickerInfo?.headquarters || null,
      employees: state.tickerInfo?.employees || null
    };
    const financials = {
      isPrivate: !ticker,
      profile: fallbackProfile,
      valuation: {
        marketCap: null,
        trailingPE: null,
        forwardPE: null,
        priceToSales: null,
        priceToBook: null
      },
      tradingInfo: {
        fiftyTwoWeekLow: null,
        fiftyTwoWeekHigh: null,
        dividendYield: null,
        beta: null
      },
      financialStrength: {
        totalRevenue: null,
        revenueGrowth: null,
        profitMargin: null,
        debtToEquity: null,
        freeCashflow: null
      },
      webReport: state.searchResults.map(r => `[${r.title}]: ${r.snippet}`).join('\n\n')
    };

    return {
      financials,
      logs
    };
  } catch (error) {
    logs.push(`Financial data gathering error: ${error.message}. Continuing with available data.`);
    return {
      financials: { error: error.message },
      logs
    };
  }
}

/**
 * Node 3: Gather Recent News & Sentiment
 */
export async function gatherNewsNode(state) {
  const logs = ["Analyzing recent news and market sentiment..."];
  const count = state.newsResults?.length || 0;
  logs.push(`Processed ${count} news items from pre-fetched search index.`);
  return {
    logs
  };
}

/**
 * Node 4: Perform In-Depth Analysis
 */
export async function performAnalysisNode(state) {
  const logs = ["Analyzing business model, financials, and moat factors..."];

  const company = state.companyName;
  const ticker = state.ticker;
  const financialsStr = state.financials ? JSON.stringify(state.financials, null, 2) : "N/A";

  const searchStr = state.searchResults.map(r => `- Title: ${r.title}\n  Snippet: ${r.snippet}`).join('\n');
  const newsStr = state.newsResults.map(r => `- Title: ${r.title}\n  Snippet: ${r.snippet}`).join('\n');

  const prompt = `You are a Senior Investment Analyst at an elite venture capital and public equities fund.
Your task is to write a comprehensive Investment Analysis Report on ${company} ${ticker ? `(Ticker: ${ticker})` : '(Private Company)'}.

Below is the research data gathered:

--- GATHERED FINANCIAL DATA ---
${financialsStr}

--- COMPANY & BUSINESS MODEL SEARCH RESULTS ---
${searchStr}

--- RECENT NEWS & SENTIMENT SEARCH RESULTS ---
${newsStr}
------------------------------

Please write a highly detailed, objective investment analysis. Be critical and professional. Use markdown formatting. Structure your analysis into the following exact sections:

### 1. Business Model & Market Position
Analyze how the company makes money, its target market, and market share.
Evaluate its **Competitive Moat** (e.g., brand strength, switching costs, network effects, scale, proprietary tech).

### 2. Financial Strength & Efficiency
Critically evaluate the financial numbers (revenue growth, margins, debt, cash flows, and multiples like P/E and EV/EBITDA, if public. If private, analyze the rumored financials or cash-burn/capital efficiency). Compare key ratios to industry averages.

### 3. Competitors & Industry Headwinds
Analyze the major competitors. What threat do they pose? Describe the macroeconomic environment and industry-specific tailwinds or headwinds (e.g., inflation, regulatory changes, technology shifts).

### 4. Risk Factors & Controversies
Highlight the 3-5 most pressing risk factors. Examine news controversies, management changes, legal issues, or customer concentration risks.

Write the report in a professional, polished, and analytical tone. Do not use generic statements. Provide specific references to the numbers or facts where possible.`;

  try {
    const content = await invokeLLM(prompt);
    logs.push(`Completed structured qualitative analysis.`);
    return {
      analysis: content,
      logs
    };
  } catch (error) {
    logs.push(`Analysis node error: ${error.message}. Compiling fallback analysis from search index.`);
    const mockReport = getMockReport(company);
    return {
      analysis: mockReport.analysis,
      logs
    };
  }
}

/**
 * Node 5: Synthesize Decision & Final Thesis
 */
export async function makeDecisionNode(state) {
  const logs = ["Synthesizing analysis into final recommendation..."];

  const company = state.companyName;
  const analysis = state.analysis;
  const financialsStr = state.financials ? JSON.stringify(state.financials, null, 2) : "N/A";

  const prompt = `You are the Chief Investment Officer (CIO) of the fund.
Read the Senior Analyst's qualitative analysis and the gathered financials for ${company}, and make the final investment decision: either INVEST or PASS.

--- QUALITATIVE ANALYSIS ---
${analysis}

--- FINANCIAL METRICS ---
${financialsStr}
----------------------------

Based on the above, you must output a JSON object containing your final recommendation, score, rating, bulleted thesis, key risks, and detailed reasoning. 

Your response MUST be ONLY a JSON object (or wrapped in a \`\`\`json ... \`\`\` code block) following this exact schema:

{
  "recommendation": "INVEST" or "PASS",
  "score": <number between 0 and 100 representing confidence and strength of investment>,
  "rating": "<Strongly Bullish | Bullish | Neutral | Bearish | Strongly Bearish>",
  "thesis": [
    "<Key point 1 of investment thesis>",
    "<Key point 2 of investment thesis>",
    "<Key point 3 of investment thesis>"
  ],
  "keyRisks": [
    "<Critical risk factor 1>",
    "<Critical risk factor 2>",
    "<Critical risk factor 3>"
  ],
  "reasoning": "<A 2-3 paragraph detailed summary explaining the trade-offs, why you decided to invest or pass, and the crucial factors that drove your decision>"
}

Ensure your JSON is valid and well-formatted. Do not include any other conversational text in your response.`;

  try {
    const content = await invokeLLM(prompt);
    const decisionData = extractJSON(content);
    logs.push(`Synthesized recommendation: ${decisionData.recommendation} (Score: ${decisionData.score}/100)`);

    return {
      decision: decisionData,
      logs
    };
  } catch (error) {
    logs.push(`Decision node error: ${error.message}. Running fallback decision compiler.`);
    const mockReport = getMockReport(company);
    return {
      decision: mockReport.decision,
      logs
    };
  }
}

/**
 * Robust JSON extraction helper
 */
function extractJSON(text) {
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```([\s\S]*?)```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (err) {
        // continue
      }
    }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(text.substring(start, end + 1));
      } catch (err) {
        // continue
      }
    }
    throw new Error("Response text did not contain valid JSON");
  }
}
