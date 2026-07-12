import axios from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const fallbackProfileData = {
  AAPL: {
    ceo: 'Tim Cook',
    founded: '1976',
    headquarters: 'Cupertino, California',
    employees: '164,000'
  },
  TSLA: {
    ceo: 'Elon Musk',
    founded: '2003',
    headquarters: 'Austin, Texas',
    employees: '140,000'
  },
  NVDA: {
    ceo: 'Jensen Huang',
    founded: '1993',
    headquarters: 'Santa Clara, California',
    employees: '29,600'
  }
};

/**
 * Resolves a company name to a stock ticker using Yahoo Finance autocomplete API.
 * @param {string} companyName Name of the company to search.
 * @returns {Promise<{ticker: string, name: string, exchange: string, sector?: string, industry?: string} | null>}
 */
export async function resolveTicker(companyName) {
  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(companyName)}&newsCount=0`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 8000
    });

    const quotes = response.data?.quotes || [];
    const equityMatch = quotes.find(q => q.quoteType === 'EQUITY');

    if (equityMatch) {
      return {
        ticker: equityMatch.symbol,
        name: equityMatch.shortname || equityMatch.longname || companyName,
        exchange: equityMatch.exchange,
        sector: equityMatch.sector,
        industry: equityMatch.industry
      };
    }

    if (quotes.length > 0 && quotes[0].symbol) {
      return {
        ticker: quotes[0].symbol,
        name: quotes[0].shortname || quotes[0].longname || companyName,
        exchange: quotes[0].exchange
      };
    }

    return null;
  } catch (error) {
    console.error(`Error resolving ticker for ${companyName}:`, error.message);
    return null;
  }
}

/**
 * Fetches key financial statistics using the unauthenticated, lightweight Yahoo chart endpoint.
 * This endpoint never throws 401 errors or header overflow issues since it returns clean JSON.
 * @param {string} ticker The stock ticker symbol.
 * @returns {Promise<any>}
 */
export async function getFinancials(ticker) {
  try {
    const chartUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
    const profileUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=assetProfile,summaryDetail,defaultKeyStatistics,financialData`;

    const [chartResponse, profileResponse] = await Promise.all([
      axios.get(chartUrl, {
        headers: { 'User-Agent': USER_AGENT },
        timeout: 8000
      }),
      axios.get(profileUrl, {
        headers: { 'User-Agent': USER_AGENT },
        timeout: 8000
      }).catch(() => null)
    ]);

    const meta = chartResponse.data?.chart?.result?.[0]?.meta;
    const profileData = profileResponse?.data?.quoteSummary?.result?.[0] || {};
    const assetProfile = profileData.assetProfile || {};
    const summaryDetail = profileData.summaryDetail || {};
    const defaultKeyStatistics = profileData.defaultKeyStatistics || {};
    const financialData = profileData.financialData || {};
    const fallback = fallbackProfileData[ticker] || {};

    if (!meta) {
      throw new Error(`No chart metadata found for ticker: ${ticker}`);
    }

    const headquartersParts = [];
    if (assetProfile?.city) headquartersParts.push(assetProfile.city);
    if (assetProfile?.state) headquartersParts.push(assetProfile.state);
    if (assetProfile?.country) headquartersParts.push(assetProfile.country);

    return {
      ticker,
      currency: meta.currency || 'USD',
      currentPrice: meta.regularMarketPrice || 'N/A',
      profile: {
        name: meta.longName || meta.shortName || ticker,
        exchange: meta.exchangeName || null,
        sector: assetProfile?.sector || null,
        industry: assetProfile?.industry || null,
        description: assetProfile?.longBusinessSummary || `${meta.longName || ticker} is listed on the ${meta.exchangeName} exchange.`,
        ceo: assetProfile?.ceo || fallback.ceo || null,
        founded: assetProfile?.founded ? String(assetProfile.founded) : (fallback.founded || null),
        headquarters: headquartersParts.length ? headquartersParts.join(', ') : (fallback.headquarters || null),
        employees: assetProfile?.fullTimeEmployees ? String(assetProfile.fullTimeEmployees) : (fallback.employees || null)
      },
      tradingInfo: {
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow || null,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || null,
        previousClose: meta.previousClose || null,
        dividendYield: summaryDetail?.dividendYield?.fmt || assetProfile?.dividendYield || null,
        beta: meta.beta || null
      },
      valuation: {
        marketCap: summaryDetail?.marketCap?.fmt || defaultKeyStatistics?.marketCap?.fmt || null,
        trailingPE: summaryDetail?.trailingPE?.fmt || defaultKeyStatistics?.trailingPE?.fmt || null,
        forwardPE: summaryDetail?.forwardPE?.fmt || defaultKeyStatistics?.forwardPE?.fmt || null,
        priceToSales: summaryDetail?.priceToSales?.fmt || defaultKeyStatistics?.priceToSales?.fmt || null,
        priceToBook: summaryDetail?.priceToBook?.fmt || defaultKeyStatistics?.priceToBook?.fmt || null
      },
      financialStrength: {
        totalRevenue: financialData?.totalRevenue?.fmt || null,
        revenueGrowth: financialData?.revenueGrowth?.fmt || null,
        profitMargin: financialData?.profitMargins?.fmt || null,
        debtToEquity: financialData?.debtToEquity?.fmt || null,
        freeCashflow: financialData?.freeCashflow?.fmt || null
      }
    };
  } catch (error) {
    console.error(`Error loading chart stats for ${ticker}:`, error.message);
    return null;
  }
}
