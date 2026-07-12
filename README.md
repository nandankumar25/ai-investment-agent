# AI Investment Research Agent

An autonomous, multi-step AI Investment Research Agent that analyzes target companies, performs financial and sentiment audits, and outputs a firm **INVEST** or **PASS** decision backed by an institutional-grade investment thesis.

Built using **React** (Frontend), **Node.js/Express** (Backend), and **LangGraph.js / LangChain.js** (Agent Logic).

---

## Overview

This application acts as an autonomous financial analyst network:
1. **Ticker Resolution**: Dynamically maps corporate names (e.g. "Apple") to their official stock ticker (e.g. "AAPL") and exchange using Yahoo Finance.
2. **Financial Aggregation**: Fetches real-time institutional metrics (P/E ratios, EV/EBITDA, Debt-to-Equity, Profit Margins, Revenue Growth, and Free Cash Flow) via Yahoo Finance APIs.
3. **Sentiment Scraping**: Searches recent web articles and news releases to extract market sentiment and track current headwinds or regulatory controversies.
4. **Qualitative Evaluation**: Uses a structured LLM analyst prompt to compose a markdown report covering competitive moats, financials, and macro risks.
5. **Synthesis & CIO Decision**: Aggregates the qualitative and quantitative data to make a final investment recommendation (`INVEST` or `PASS`), calculate a confidence score (0-100), assign a rating, and formulate a bulleted thesis.
6. **Agent Audit Terminal**: Emulates a real-time terminal log viewer on the frontend, displaying step-by-step agent state transitions and tool outputs.

---

## How to Run It

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### 2. Installation
Install all root, backend, and frontend dependencies by running the following command from the root directory:
```bash
npm run install:all
```
*(This automatically runs `npm install` inside both `backend/` and `frontend/` subdirectories).*

### 3. Environment Setup
Configure your LLM provider by editing the environment file.
1. Go to the `backend` folder.
2. Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your API key:
   - **GEMINI_API_KEY** (Recommended: Google Gemini has a free tier and is the primary model used).
   - **OPENAI_API_KEY** (Alternative: standard GPT-4o-mini client).
   - **TAVILY_API_KEY** (Optional: used for search. If not provided, the agent falls back to free web scraping).

> [!NOTE]
> **No API Key? No Problem! (Demo Mode)**
> If you start the app without configuring any API keys in `.env`, the server automatically operates in **Demo Mode**. It will simulate the agent's progress logs and display pre-generated, highly realistic, and professional research dashboards for common companies (Apple, Tesla, Nvidia) and dynamic mockups for any other search query. This lets you inspect the UI immediately!

### 4. Running the Application
Launch both the backend server (port 5000) and the frontend dev server (Vite) concurrently using:
```bash
npm run dev
```
Once started, open your browser and navigate to:
**`http://localhost:5173`**

---

## How it Works: Architecture

The agent's core reasoning is implemented using **LangGraph.js**, which constructs a stateful, deterministic graph workflow:

```
[Start] ──> [Resolve Ticker] ──> [Gather Financials] ──> [Gather News]
                                                               │
[End]   <── [Make Decision]  <──   [Perform Analysis] <────────┘
```

1. **StateAnnotation**: Declares the shared global state carried through the nodes (e.g. `companyName`, `ticker`, `financials`, `searchResults`, `newsResults`, `analysis`, `decision`, `logs`).
2. **Resolve Ticker Node**: Searches Yahoo Finance autocomplete to fetch the ticker symbol, exchange, and core industry/sector profile.
3. **Gather Financials Node**: Extracts real-time statistics (multiples, leverage, liquidity) from Yahoo Finance or performs custom financial search scraping.
4. **Gather News Node**: Performs search queries focused on recent stock news, controversies, and regulatory friction.
5. **Perform Analysis Node**: Leverages the LLM model to write an objective, multi-chapter markdown report analyzing competitive moats, financial health, and industrial headwinds.
6. **Make Decision Node**: Evaluates the analysis and financials, yielding a formatted JSON response containing the final decision, thesis, and scoring matrix.

---

## Key Decisions & Trade-Offs

### 1. Custom Web Scraping Fallbacks
*   **Decision**: Instead of failing when paid search API keys (like Tavily or SerpAPI) are missing, we implemented a custom HTML crawler for DuckDuckGo and Yahoo Finance Query endpoints.
*   **Trade-off**: Web scraping is more volatile than structured JSON APIs, but it ensures that the application is 100% functional and free-to-run out-of-the-box without forcing the evaluator to register for external developer credentials.

### 2. Sequential vs Parallel Chaining
*   **Decision**: Executed nodes sequentially rather than in parallel.
*   **Trade-off**: While parallel execution is slightly faster, sequential nodes simplify progress logging, provide a highly readable audit trail on the UI, and allow downstream nodes to easily adapt to ticker resolutions from upstream nodes.

### 3. Markdown Formatting vs Structured JSON
*   **Decision**: We split the LLM tasks into a qualitative node that generates rich markdown chapters and a final synthesis node that outputs JSON.
*   **Trade-off**: A single prompt doing both often suffers from formatting errors. Chaining them ensures that the qualitative analysis remains descriptive, while the final investment scorecard is easily parsed as JSON by our React state manager.

---

## Example Runs

Below are summaries of the agent's decisions on representative companies:

### 1. Apple Inc. (AAPL)
*   **Decision**: **INVEST**
*   **Score**: 88/100
*   **Rating**: Bullish
*   **Key Thesis**: Unrivaled ecosystem lock-in (2B+ active devices), expanding high-margin Services segment, aggressive share buyback floor.
*   **Risks**: US/EU antitrust scrutiny on App Store policies, device cycle elongation.

### 2. Tesla Inc. (TSLA)
*   **Decision**: **PASS**
*   **Score**: 45/100
*   **Rating**: Bearish
*   **Key Thesis**: Automotive margin contraction, flat y/y delivery volumes, valuation premium (68x PE) heavily decoupled from current automotive growth.
*   **Risks**: Speculative Full Self-Driving (FSD) timeline, Elon Musk key-man risk, BYD EV dominance.

### 3. NVIDIA Corporation (NVDA)
*   **Decision**: **INVEST**
*   **Score**: 82/100
*   **Rating**: Bullish
*   **Key Thesis**: Near-monopoly in AI acceleration hardware, CUDA developer software moat, Blackwell hardware cycles sold out.
*   **Risks**: Geo-exposure to TSMC in Taiwan, capital expenditure sustainability of hyper-scalers.

---

## Future Roadmap (What to improve with more time)

1. **Multi-Agent Debates**: Deploy a "Bull Analyst" agent and a "Bear Analyst" agent to debate the company's valuation before letting a separate "CIO" agent make the final decision.
2. **Interactive Charting**: Integrate `recharts` to render historical stock chart data and quarterly balance sheet trends visually rather than just showing text-based stats.
3. **Portfolio Backtesting**: Implement a sandbox letting users see how a portfolio would have performed historically if they invested in all targets recommended by the agent.
4. **SEC Filings Audit**: Connect the agent to an SEC EDGAR crawler to parse recent 10-K and 10-Q reports for hidden lease obligations, customer concentration risks, and executive options schedules.
