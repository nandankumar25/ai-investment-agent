import { resolveTicker } from './finance.js';
import { webSearch } from './search.js';

const TRUSTED_DOMAINS = [
  'wikipedia.org',
  'bloomberg.com',
  'reuters.com',
  'sec.gov',
  'investopedia.com',
  'yahoo.com',
  'nasdaq.com',
  'marketwatch.com',
  'forbes.com',
  'cnbc.com',
  'wsj.com',
  'morningstar.com',
  'financialpost.com',
  'ft.com',
  'wsj.com'
];

const COMPANY_SIGNALS = [
  'company',
  'inc',
  'corp',
  'corporation',
  'llc',
  'group',
  'limited',
  'plc',
  'stock',
  'ticker',
  'ipo',
  'market cap',
  'headquarters',
  'founded',
  'revenue',
  'investor',
  'investors',
  'business model',
  'publicly traded',
  'private equity',
  'venture capital',
  'analysis',
  'financials',
  'earnings'
];

const normalize = (value) => value.trim().toLowerCase();

export async function verifyCompanyExists(companyName) {
  const normalized = companyName?.trim();
  if (!normalized) {
    throw new Error('Company name is required');
  }

  const tickerResult = await resolveTicker(normalized);
  if (tickerResult) {
    return {
      found: true,
      source: 'ticker',
      tickerInfo: tickerResult
    };
  }

  const query = `${normalized} company profile investor relations business overview`;
  const searchResults = await webSearch(query);
  const foundBySearch = isReliableCompanySearch(searchResults, normalized);

  return {
    found: foundBySearch,
    source: foundBySearch ? 'search' : 'none',
    searchResults,
    reason: foundBySearch
      ? 'Reliable search results were detected for the given company name.'
      : 'No reliable public company information could be validated for the given name.'
  };
}

function isReliableCompanySearch(results, normalizedQuery) {
  if (!Array.isArray(results) || results.length === 0) {
    return false;
  }

  let score = 0;
  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  for (const item of results.slice(0, 5)) {
    const title = normalize(item.title || '');
    const snippet = normalize(item.snippet || '');
    const text = `${title} ${snippet}`;
    const url = (item.url || '').toLowerCase();

    if (!text) continue;

    if (text.includes(normalizedQuery)) {
      score += 2;
    }

    for (const term of queryTerms) {
      if (term.length >= 3 && text.includes(term)) {
        score += 1;
        break;
      }
    }

    if (COMPANY_SIGNALS.some(signal => text.includes(signal))) {
      score += 1;
    }

    if (TRUSTED_DOMAINS.some(domain => url.includes(domain))) {
      score += 2;
    }

    if (/\bwikipedia\b/.test(url) || /\bwiki\b/.test(url)) {
      score += 1;
    }
  }

  return score >= 4;
}
