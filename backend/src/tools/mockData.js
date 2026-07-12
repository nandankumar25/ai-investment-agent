/**
 * Generates realistic investment research data for demo purposes
 * when live Gemini or OpenAI API keys are not supplied.
 */
export function getMockReport(companyName) {
  const normalized = companyName.toLowerCase();

  if (normalized.includes('apple') || normalized.includes('aapl')) {
    return getAppleMock();
  } else if (normalized.includes('tesla') || normalized.includes('tsla')) {
    return getTeslaMock();
  } else if (normalized.includes('nvidia') || normalized.includes('nvda')) {
    return getNvidiaMock();
  } else {
    return getGenericMock(companyName);
  }
}

function getAppleMock() {
  return {
    companyName: "Apple Inc.",
    ticker: "AAPL",
    tickerInfo: {
      ticker: "AAPL",
      name: "Apple Inc.",
      exchange: "NMS",
      sector: "Technology",
      industry: "Consumer Electronics"
    },
    financials: {
      profile: {
        sector: "Technology",
        industry: "Consumer Electronics",
        ceo: "Tim Cook",
        founded: "1976",
        headquarters: "Cupertino, California",
        employees: "164,000",
        description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company also sells various related services, including Apple Music, Apple Pay, and iCloud."
      },
      valuation: {
        marketCap: "3.45T",
        trailingPE: "32.4",
        forwardPE: "28.1",
        priceToSales: "8.9",
        priceToBook: "44.2",
        enterpriseValue: "3.42T",
        evToRevenue: "8.7",
        evToEbitda: "23.5"
      },
      financialStrength: {
        totalRevenue: "391.0B",
        revenueGrowth: "5.4%",
        grossProfit: "172.5B",
        operatingMargins: "30.7%",
        profitMargin: "26.3%",
        returnOnEquity: "154.2%",
        totalDebt: "102.5B",
        debtToEquity: "145.3%",
        freeCashflow: "108.2B",
        operatingCashflow: "116.4B",
        currentRatio: "1.04",
        recommendation: "buy"
      },
      tradingInfo: {
        fiftyTwoWeekLow: "164.08",
        fiftyTwoWeekHigh: "237.49",
        dividendYield: "0.45%",
        beta: "1.24"
      }
    },
    searchResults: [
      { title: "Apple Inc. (AAPL) Company Overview & Strategy", url: "https://finance.yahoo.com/quote/AAPL", snippet: "Apple operates a hardware-services ecosystem powered by proprietary operating systems iOS and macOS, command high customer loyalty." },
      { title: "Apple's Competitive Moat: An Ecosystem Analysis", url: "https://www.morningstar.com", snippet: "Apple holds a wide competitive moat due to high switching costs, network effects within its ecosystem, and strong brand equity." }
    ],
    newsResults: [
      { title: "Apple announces Apple Intelligence roll out", url: "https://www.reuters.com", snippet: "Apple is launching its generative AI suite Apple Intelligence across iPhone, iPad and Mac, boosting demand cycles." },
      { title: "Antitrust scrutiny intensifies on App Store policies", url: "https://www.bloomberg.com", snippet: "US DOJ and EU regulators target Apple's closed ecosystem policies, threatening services revenue margins." }
    ],
    analysis: `### 1. Business Model & Market Position
Apple Inc. (AAPL) commands the most successful consumer hardware-software ecosystem in history. Its core business revolves around the iPhone (approx. 50% of revenue), supported by iPads, Macs, and Wearables. The primary growth engine and high-margin segment is **Services** (App Store, Apple Pay, iCloud, Apple TV+), which now accounts for over 22% of revenue and sports gross margins exceeding 70%.

Apple's **Competitive Moat** is exceptionally wide:
*   **High Switching Costs:** Moving from iOS to Android involves losing access to purchased apps, iMessage, and device sync, keeping customer retention above 90%.
*   **Brand Equity:** The Apple brand represents premium quality, allowing it to capture over 80% of global smartphone profits despite having lower volume market share.
*   **Ecosystem Lock-in:** Hardware products are designed to work seamlessly together (Watch, AirPods, Mac), driving multi-device ownership.

### 2. Financial Strength & Efficiency
Apple is a financial powerhouse.
*   **Cash Flow:** Generates over $100B in free cash flow annually, used aggressively for share repurchases ($90B+ per year) and dividends.
*   **Profitability:** Gross margins are stable at 46%, and operating margins are 30.7%. Return on Equity (ROE) is artificially inflated (154%) due to its capital structure and share buyback program.
*   **Balance Sheet:** While Apple holds $102B in debt, it holds even more cash and cash equivalents, giving it a net cash positive position.

### 3. Competitors & Industry Headwinds
Apple faces competition from Samsung and Chinese manufacturers (Xiaomi, Huawei) in hardware, and Google/Microsoft in software/AI. 
*   **AI Integration:** Apple was perceived as lagging in AI but has responded with *Apple Intelligence*, partnering with OpenAI to integrate models directly into the operating system.
*   **Hardware Saturation:** Smartphone upgrade cycles are lengthening as hardware improvements become incremental, forcing reliance on services and price increases.

### 4. Risk Factors & Controversies
*   **Antitrust Actions:** Facing major regulatory lawsuits from the US DOJ and European Union regarding monopolistic practices in the App Store and NFC chip access.
*   **Geopolitical Risk:** High supply chain exposure to China and Taiwan (Foxconn/TSMC). Any trade conflict could severely disrupt manufacturing.
*   **AI Execution:** Relying on partners for leading LLMs creates dependencies; failing to deliver consumer-grade AI could accelerate migrations to competitors.`,
    decision: {
      recommendation: "INVEST",
      score: 88,
      rating: "Bullish",
      thesis: [
        "Unrivaled ecosystem lock-in with over 2 billion active devices globally.",
        "High-margin Services division continues to grow faster than hardware, expanding overall margins.",
        "Unparalleled capital return program with over $90B in annual buybacks."
      ],
      keyRisks: [
        "Escalating antitrust lawsuits in the US and EU targeting Services revenue.",
        "Geopolitical supply chain concentration in China/Taiwan.",
        "Longer device upgrade cycles flattening hardware unit growth."
      ],
      reasoning: "Apple represents one of the lowest-risk, highest-quality cash generators in the equity markets. Despite trading at a premium valuation (32.4x PE), its wide moat, pricing power, and massive buyback program provide a strong floor. The launch of Apple Intelligence is likely to trigger a multi-year hardware upgrade cycle. We recommend a core long-term investment position."
    },
    logs: [
      "Initiating investment research for \"Apple\"...",
      "Resolved ticker symbol: AAPL (NMS)",
      "Retrieved business overview search results.",
      "Gathering financial data...",
      "Successfully loaded valuation and balance sheet metrics from Yahoo Finance.",
      "Gathering recent news and market sentiment...",
      "Retrieved 2 recent news articles and sentiment markers.",
      "Analyzing business model, financials, and moat factors...",
      "Completed structured qualitative analysis.",
      "Synthesizing analysis into final recommendation...",
      "Synthesized recommendation: INVEST (Score: 88/100)"
    ]
  };
}

function getTeslaMock() {
  return {
    companyName: "Tesla Inc.",
    ticker: "TSLA",
    tickerInfo: {
      ticker: "TSLA",
      name: "Tesla Inc.",
      exchange: "NMS",
      sector: "Consumer Cyclical",
      industry: "Auto Manufacturers"
    },
    financials: {
      profile: {
        sector: "Consumer Cyclical",
        industry: "Auto Manufacturers",
        ceo: "Elon Musk",
        founded: "2003",
        headquarters: "Austin, Texas",
        employees: "140,000",
        description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally."
      },
      valuation: {
        marketCap: "820B",
        trailingPE: "68.2",
        forwardPE: "52.4",
        priceToSales: "7.8",
        priceToBook: "12.3",
        enterpriseValue: "812B",
        evToRevenue: "7.5",
        evToEbitda: "41.2"
      },
      financialStrength: {
        totalRevenue: "96.8B",
        revenueGrowth: "1.2%",
        grossProfit: "17.4B",
        operatingMargins: "7.8%",
        profitMargin: "13.4%",
        returnOnEquity: "21.1%",
        totalDebt: "9.5B",
        debtToEquity: "15.2%",
        freeCashflow: "4.4B",
        operatingCashflow: "13.2B",
        currentRatio: "1.87",
        recommendation: "hold"
      },
      tradingInfo: {
        fiftyTwoWeekLow: "138.80",
        fiftyTwoWeekHigh: "271.00",
        dividendYield: "N/A",
        beta: "2.31"
      }
    },
    searchResults: [
      { title: "Tesla Inc. (TSLA) Corporate Strategy and Robotaxis", url: "https://finance.yahoo.com", snippet: "Tesla is shifting priority from low-cost EVs to Full Self-Driving (FSD) technology, AI training compute, and autonomous Robotaxis." },
      { title: "Tesla Energy Storage: Megapacks Growth", url: "https://www.tesla.com", snippet: "Tesla Energy division is experiencing 100%+ year-over-year growth in Megapack deployment for utility grids." }
    ],
    newsResults: [
      { title: "Tesla Q2 delivery numbers beat low expectations", url: "https://www.reuters.com", snippet: "Tesla delivered 443,956 vehicles in Q2, beating consensus estimates but declining compared to last year's records." },
      { title: "FSD regulatory approval delayed in key markets", url: "https://www.bloomberg.com", snippet: "Full Self Driving remains Level 2, facing regulatory scrutiny in the US and delays in China launch." }
    ],
    analysis: `### 1. Business Model & Market Position
Tesla (TSLA) is the global leader in electric vehicles (EVs) and battery storage. However, its business model is transitioning. Rather than just an auto manufacturer, management positions Tesla as an AI and robotics company.
Core revenues come from EV sales (Model 3/Y, Cybertruck), but profit streams are shifting towards:
*   **FSD Software:** High-margin recurring subscription revenue.
*   **Tesla Energy:** Grid-scale storage (Megapack) and home solar/Powerwall.
*   **Robotaxi Fleet:** Planned autonomous ride-hailing network (Cybercab).

Tesla's **Competitive Moat** is medium-to-wide:
*   **Cost Leadership:** Gigafactory manufacturing efficiency allows Tesla to maintain positive operating margins while competitors lose money on EVs.
*   **Supercharger Network:** The dominant charging infrastructure in North America, creating a standard others are forced to adopt.
*   **Data Advantage:** Millions of cars driving and gathering video data for FSD training.

### 2. Financial Strength & Efficiency
Tesla's financial profile has softened over the last 18 months.
*   **Margins Compression:** Operating margins dropped from peak of 16%+ to 7.8% due to aggressive price cuts to maintain volume.
*   **Revenue Flatlining:** Revenue growth slowed to 1.2% as the EV market reached saturation and competition intensified.
*   **Balance Sheet:** Remains pristine. Tesla has $29B in cash against only $9.5B in debt, giving it substantial runway to invest in AI and energy storage.

### 3. Competitors & Industry Headwinds
*   **Competition:** Intense competition from BYD in China and legacy automakers (Hyundai, Ford, GM) in the US and Europe. BYD regularly rivals Tesla in raw battery EV sales.
*   **EV Slowdown:** Global hybrid preference and slowing EV demand have created inventory headwinds, forcing price discounts.

### 4. Risk Factors & Controversies
*   **AI Valuation Premium:** At 68x PE, Tesla is valued as a software company, but 85% of revenue is still cyclical hardware manufacturing. If FSD fails to achieve full autonomy soon, the stock faces massive downside.
*   **Key Man Risk:** CEO Elon Musk's divided attention across X, SpaceX, xAI, and Neuralink, alongside controversial public stances, creates severe brand and key-man risk.`,
    decision: {
      recommendation: "PASS",
      score: 45,
      rating: "Bearish",
      thesis: [
        "Valuation (68x PE) is extremely decoupled from slowing automotive growth (1.2% y/y).",
        "Automotive gross margins continue to slide due to competitive price wars.",
        "Full Self-Driving (FSD) autonomy timelines remain highly speculative and face strict regulatory hurdles."
      ],
      keyRisks: [
        "Failing to achieve true Level 4/5 autonomy, popping the AI-driven valuation bubble.",
        "Rising competition from BYD and cheap Chinese EVs globally.",
        "Key man risk and brand dilution from Elon Musk's external controversies."
      ],
      reasoning: "Tesla is a pioneering company with an excellent energy storage division and clean balance sheet. However, as an investment, the risk-reward ratio is unfavorable. It is currently valued as an autonomous driving monopoly, yet its actual business remains cyclical car manufacturing with falling margins. We choose to PASS at current price levels and wait for margins to stabilize or for FSD to secure regulatory approval."
    },
    logs: [
      "Initiating investment research for \"Tesla\"...",
      "Resolved ticker symbol: TSLA (NMS)",
      "Retrieved business overview search results.",
      "Gathering financial data...",
      "Successfully loaded valuation and balance sheet metrics from Yahoo Finance.",
      "Gathering recent news and market sentiment...",
      "Retrieved 2 recent news articles and sentiment markers.",
      "Analyzing business model, financials, and moat factors...",
      "Completed structured qualitative analysis.",
      "Synthesizing analysis into final recommendation...",
      "Synthesized recommendation: PASS (Score: 45/100)"
    ]
  };
}

function getNvidiaMock() {
  return {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    tickerInfo: {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      exchange: "NMS",
      sector: "Technology",
      industry: "Semiconductors"
    },
    financials: {
      profile: {
        sector: "Technology",
        industry: "Semiconductors",
        ceo: "Jensen Huang",
        founded: "1993",
        headquarters: "Santa Clara, California",
        employees: "29,600",
        description: "NVIDIA Corporation focuses on personal computer graphics, graphics processing unit (GPU), and also on artificial intelligence solutions. It operates through two segments: Compute & Networking, and Graphics."
      },
      valuation: {
        marketCap: "3.20T",
        trailingPE: "65.4",
        forwardPE: "34.2",
        priceToSales: "31.2",
        priceToBook: "58.4",
        enterpriseValue: "3.18T",
        evToRevenue: "30.8",
        evToEbitda: "54.1"
      },
      financialStrength: {
        totalRevenue: "96.3B",
        revenueGrowth: "268.0%",
        grossProfit: "72.4B",
        operatingMargins: "64.9%",
        profitMargin: "53.2%",
        returnOnEquity: "115.3%",
        totalDebt: "8.5B",
        debtToEquity: "18.5%",
        freeCashflow: "39.4B",
        operatingCashflow: "42.5B",
        currentRatio: "3.52",
        recommendation: "strong_buy"
      },
      tradingInfo: {
        fiftyTwoWeekLow: "40.22",
        fiftyTwoWeekHigh: "140.76",
        dividendYield: "0.03%",
        beta: "1.89"
      }
    },
    searchResults: [
      { title: "NVIDIA Blackwell GPU Architecture Demand", url: "https://nvidianews.nvidia.com", snippet: "Demand for Nvidia's next-generation Blackwell B200 AI GPUs is outpacing supply, with orders booked through 2026." },
      { title: "NVIDIA CUDA Platform Moat in AI", url: "https://www.semianalysis.com", snippet: "Nvidia's proprietary CUDA programming software locks developers into Nvidia hardware, creating a near-insurmountable competitive barrier." }
    ],
    newsResults: [
      { title: "NVIDIA reports record revenue growth in Data Center", url: "https://www.cnbc.com", snippet: "Nvidia's data center segment grew 427% year-over-year, driven by hyper-scalers (Microsoft, AWS, Google) purchasing H100 chips." },
      { title: "US expands AI chip export curbs to Middle East", url: "https://www.nytimes.com", snippet: "Geopolitical tensions lead US government to limit high-end AI processor sales, clipping Nvidia's expansion in certain markets." }
    ],
    analysis: `### 1. Business Model & Market Position
NVIDIA (NVDA) has transitioned from a gaming graphics company to the foundational infrastructure provider of the Artificial Intelligence era. Its core business is GPU chip design (H100, H200, Blackwell), which power training and inference of Large Language Models.
Revenues are heavily concentrated in the **Data Center** division (approx. 87% of sales).

NVIDIA's **Competitive Moat** is arguably the widest in technology:
*   **CUDA Software Stack:** Developers have spent 15+ years building GPU-accelerated applications using CUDA. CUDA only runs on NVIDIA chips. This software ecosystem creates a massive barrier for AMD or Intel.
*   **System-Level Design:** NVIDIA doesn't just sell chips; it sells entire server nodes, networking switches (Mellanox InfiniBand), and clusters, optimizing performance at a scale competitors cannot match.

### 2. Financial Strength & Efficiency
NVIDIA's recent financial metrics are unprecedented for a large-scale hardware designer.
*   **Hypergrowth:** Revenue grew 268% y/y, powered by infinite demand for AI computing power.
*   **Extreme Profitability:** Operating margins are a staggering 64.9% and net profit margins are 53.2%. NVIDIA effectively acts as a tollbooth on the AI economy, capturing the majority of value.
*   **Balance Sheet & FCF:** Free cash flow margin is above 40%, generating $39B in FCF. Debt is negligible ($8.5B) compared to cash reserves of $30B+.

### 3. Competitors & Industry Headwinds
*   **Competition:** AMD is launching the MI300X chip, and custom silicon (TPUs/ASICs) developed by customers like Google, Amazon, and Meta pose a threat.
*   **CapEx Sustainability:** The primary concern is whether hyper-scalers can generate enough AI revenues to justify spending $100B+ per year on NVIDIA hardware.

### 4. Risk Factors & Controversies
*   **Supply Chain Vulnerability:** Fabricated entirely by TSMC in Taiwan. Any geopolitical event in the Taiwan Strait would halt NVIDIA's production instantly.
*   **AI Infrastructure Cycle:** High cyclicality risk. If AI software adoption slows down, hyper-scalers will cut chip procurement, causing massive inventory gluts.`,
    decision: {
      recommendation: "INVEST",
      score: 82,
      rating: "Bullish",
      thesis: [
        "CUDA software ecosystem ensures high customer retention and locks in developers.",
        "Unprecedented margins (64.9% operating) and revenue growth (268%) reflecting pricing power.",
        "Blackwell architecture release maintains a 1-2 generation lead over AMD and custom ASICs."
      ],
      keyRisks: [
        "Extreme supply chain concentration with TSMC in Taiwan.",
        "Risk of double-ordering/over-supply if hyperscaler AI monetization stalls.",
        "Regulatory export blocks on high-end computing products to China and the Middle East."
      ],
      reasoning: "NVIDIA is the pick-and-shovel play of the AI gold rush. It enjoys a near-monopoly and possesses a wide software moat. While valuation (65x trailing PE) appears high, its forward PE (34.2x) is actually reasonable given the consensus earnings growth rates. Despite cyclical risk, the structural shift to accelerated computing is permanent. We recommend investing."
    },
    logs: [
      "Initiating investment research for \"Nvidia\"...",
      "Resolved ticker symbol: NVDA (NMS)",
      "Retrieved business overview search results.",
      "Gathering financial data...",
      "Successfully loaded valuation and balance sheet metrics from Yahoo Finance.",
      "Gathering recent news and market sentiment...",
      "Retrieved 2 recent news articles and sentiment markers.",
      "Analyzing business model, financials, and moat factors...",
      "Completed structured qualitative analysis.",
      "Synthesizing analysis into final recommendation...",
      "Synthesized recommendation: INVEST (Score: 82/100)"
    ]
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getGenericMock(companyName) {
  const cleanName = companyName.trim();
  const hash = hashString(cleanName);

  // Deterministic but unique score between 45 and 92
  const score = 45 + (hash % 48);
  const recommendation = score >= 68 ? "INVEST" : "PASS";

  let rating = "Neutral";
  if (score >= 82) rating = "Strongly Bullish";
  else if (score >= 68) rating = "Bullish";
  else if (score < 55) rating = "Bearish";

  // Basic industry/sector inference
  const lowerName = cleanName.toLowerCase();
  let sector = "Technology";
  let industry = "Software & IT Services";
  let productWord = "software platforms";
  let competitors = "major industry incumbents and hyperscale tech platforms";

  if (lowerName.includes('space') || lowerName.includes('rocket') || lowerName.includes('satellite')) {
    sector = "Aerospace & Defense";
    industry = "Space Exploration & Satellite Systems";
    productWord = "launch systems and orbital infrastructure";
    competitors = "SpaceX, Boeing, Lockheed Martin, Blue Origin";
  } else if (lowerName.includes('bank') || lowerName.includes('pay') || lowerName.includes('stripe') || lowerName.includes('finance') || lowerName.includes('invest')) {
    sector = "Financial Services";
    industry = "Fintech & Transaction Processing";
    productWord = "digital transaction flow and financial infrastructure";
    competitors = "Adyen, PayPal, Block (Square), Visa, Mastercard";
  } else if (lowerName.includes('bio') || lowerName.includes('health') || lowerName.includes('med') || lowerName.includes('cure')) {
    sector = "Healthcare";
    industry = "Biotechnology & Therapeutics";
    productWord = "therapeutic pipelines and medical technologies";
    competitors = "Pfizer, Moderna, Vertex Pharmaceuticals, Amgen";
  } else if (lowerName.includes('energy') || lowerName.includes('oil') || lowerName.includes('solar') || lowerName.includes('grid')) {
    sector = "Energy & Utilities";
    industry = "Renewables & Power Distribution";
    productWord = "clean energy generation and storage assets";
    competitors = "NextEra Energy, Enphase Energy, Tesla Megapack, First Solar";
  } else if (lowerName.includes('auto') || lowerName.includes('car') || lowerName.includes('drive') || lowerName.includes('motor')) {
    sector = "Consumer Cyclical";
    industry = "Auto Manufacturers & Autonomous Tech";
    productWord = "electric vehicle platforms and telemetry";
    competitors = "Tesla, BYD, Toyota, Ford, Rivian";
  } else if (lowerName.includes('shop') || lowerName.includes('buy') || lowerName.includes('retail') || lowerName.includes('store') || lowerName.includes('market')) {
    sector = "Consumer Defensive";
    industry = "E-Commerce & Digital Retail";
    productWord = "direct-to-consumer digital channels and logistics";
    competitors = "Amazon, Shopify, Walmart, Alibaba, eBay";
  }

  const ticker = cleanName.substring(0, Math.min(cleanName.length, 4)).toUpperCase().replace(/[^A-Z]/g, 'STK');

  const thesisOptions = [
    `Strong product-market fit in high-barrier ${industry} segment.`,
    `Robust customer retention rates driven by high platform switching costs.`,
    `Prudent capitalization structure with manageable debt-to-equity levels.`,
    `Expanding gross profit margins reflecting premium pricing power.`,
    `Secular tailwinds as enterprises accelerate migration to digital ${sector} services.`,
    `A highly experienced management team with a proven capital allocation record.`
  ];

  const riskOptions = [
    `Intensifying price competition from well-funded sector competitors.`,
    `Regulatory compliance drag as international data privacy acts tighten.`,
    `High customer concentration risk within key corporate accounts.`,
    `Substantial ongoing research and development expenses to support new features.`,
    `Potential supply chain friction and wage inflation in core service hubs.`,
    `Elongating sales cycles as enterprise customers trim capital expenditure.`
  ];

  // Select 3 deterministic thesis and risk items based on the hash
  const thesis = [
    thesisOptions[hash % thesisOptions.length],
    thesisOptions[(hash + 2) % thesisOptions.length],
    thesisOptions[(hash + 4) % thesisOptions.length]
  ];

  const keyRisks = [
    riskOptions[hash % riskOptions.length],
    riskOptions[(hash + 1) % riskOptions.length],
    riskOptions[(hash + 3) % riskOptions.length]
  ];

  return {
    companyName: cleanName,
    ticker: ticker,
    tickerInfo: {
      ticker: ticker,
      name: cleanName,
      exchange: "NMS",
      sector: sector,
      industry: industry
    },
    financials: {
      profile: {
        sector: sector,
        industry: industry,
        ceo: `CEO ${cleanName}`,
        founded: `${2000 + (hash % 24)}`,
        headquarters: "San Francisco, California",
        employees: `${((hash % 45) + 5).toFixed(1)}k`,
        description: `${cleanName} is an active participant in the ${industry} space. The company designs, develops, and delivers proprietary solutions focused on optimizing customer ${productWord} globally.`
      },
      valuation: {
        marketCap: `$${((hash % 85) + 5).toFixed(1)}B`,
        trailingPE: (15 + (hash % 40)).toFixed(1),
        forwardPE: (12 + (hash % 30)).toFixed(1),
        priceToSales: (2 + (hash % 8)).toFixed(1),
        priceToBook: (3 + (hash % 15)).toFixed(1),
        enterpriseValue: `$${((hash % 90) + 6).toFixed(1)}B`,
        evToRevenue: (1 + (hash % 9)).toFixed(1),
        evToEbitda: (8 + (hash % 18)).toFixed(1)
      },
      financialStrength: {
        totalRevenue: `$${((hash % 12) + 1.2).toFixed(1)}B`,
        revenueGrowth: `${(5 + (hash % 35)).toFixed(1)}%`,
        grossProfit: `$${((hash % 5) + 0.5).toFixed(1)}B`,
        operatingMargins: `${(8 + (hash % 25)).toFixed(1)}%`,
        profitMargin: `${(5 + (hash % 18)).toFixed(1)}%`,
        returnOnEquity: `${(10 + (hash % 45)).toFixed(1)}%`,
        totalDebt: `$${((hash % 3) + 0.2).toFixed(1)}B`,
        debtToEquity: `${(15 + (hash % 60)).toFixed(1)}%`,
        freeCashflow: `$${((hash % 400) + 50).toFixed(0)}M`,
        operatingCashflow: `$${((hash % 600) + 100).toFixed(0)}M`,
        currentRatio: (1.2 + (hash % 2) * 0.7).toFixed(2),
        recommendation: recommendation === 'INVEST' ? 'buy' : 'hold'
      },
      tradingInfo: {
        fiftyTwoWeekLow: (20 + (hash % 80)).toFixed(2),
        fiftyTwoWeekHigh: (100 + (hash % 150)).toFixed(2),
        dividendYield: hash % 2 === 0 ? `${(0.5 + (hash % 3) * 0.8).toFixed(2)}%` : "N/A",
        beta: (0.7 + (hash % 15) * 0.1).toFixed(2)
      }
    },
    searchResults: [
      { title: `${cleanName} Strategic Developments & Positioning`, url: "https://finance.yahoo.com", snippet: `${cleanName} is expanding its service footprint in the ${industry} space, focusing on technology optimization.` },
      { title: `${cleanName} Industry Growth Opportunities`, url: "https://www.marketwatch.com", snippet: `Analysts highlight ${cleanName}'s potential to capture market share within the ${sector} sector due to brand positioning.` }
    ],
    newsResults: [
      { title: `${cleanName} reports quarterly performance updates`, url: "https://www.reuters.com", snippet: `Revenue metrics showed steady momentum. Management outlined expansion plans into new geographic markets.` }
    ],
    analysis: `### 1. Business Model & Market Position
${cleanName} operates a specialized business model in the ${sector} sector, primarily delivering enterprise ${productWord}.
The company enjoys a distinctive positioning in its core market:
*   **Target Market:** The firm targets middle-to-enterprise client tiers, yielding highly sticky customer relationships.
*   **Competitive Moat:** Supported by proprietary design platforms, high customer switching friction, and strong integration within corporate workflows.

### 2. Financial Strength & Efficiency
${cleanName}'s financial performance exhibits healthy fundamentals.
*   **Operating Efficiency:** Operating margins are currently sitting at ${(8 + (hash % 25)).toFixed(1)}%, which compares favorably with peer averages.
*   **Cash Generation:** Free cash flow stands at a healthy levels, allowing the firm to fund organic research and development.
*   **Valuation Ratios:** Trading at a trailing P/E of ${(15 + (hash % 40)).toFixed(1)}x, the valuation reflects a balanced risk-reward profile considering the growth trajectory.

### 3. Competitors & Industry Headwinds
*   **Competitor Landscape:** ${cleanName} competes against ${competitors}, necessitating high research and development spend.
*   **Market Headwinds:** The sector faces challenges related to global high interest rates and cautious enterprise budgets.

### 4. Risk Factors & Controversies
*   **Regulatory Exposure:** Vulnerable to changes in data residency and privacy protection acts in international regions.
*   **Supply Chain Concerns:** Exposed to talent wage pressures in the technology design segment.`,
    decision: {
      recommendation: recommendation,
      score: score,
      rating: rating,
      thesis: thesis,
      keyRisks: keyRisks,
      reasoning: `${cleanName} represents a classic case of a high-quality ${sector} operator. With a deterministic score of ${score}/100, our recommendation is to ${recommendation}. The company shows a solid growth profile of ${(5 + (hash % 35)).toFixed(1)}% along with robust liquidity. While competitive headwinds from companies like ${competitors.split(',')[0]} remain present, the wide moat elements around customer lock-in suggest long-term stability.`
    },
    logs: [
      `Initiating investment research for "${cleanName}"...`,
      `Resolved ticker symbol: ${ticker} (NMS)`,
      `Retrieved business overview search results.`,
      `Gathering financial data...`,
      `Successfully loaded valuation and balance sheet metrics from Yahoo Finance.`,
      `Gathering recent news and market sentiment...`,
      `Retrieved 2 recent news articles and sentiment markers.`,
      `Analyzing business model, financials, and moat factors...`,
      `Completed structured qualitative analysis.`,
      `Synthesizing analysis into final recommendation...`,
      `Synthesized recommendation: ${recommendation} (Score: ${score}/100)`
    ]
  };
}
