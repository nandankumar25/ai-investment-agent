import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from '../config.js';

/**
 * Perform a web search using Tavily API if available, or fall back to DuckDuckGo scraping.
 * @param {string} query The search query string.
 * @returns {Promise<Array<{title: string, url: string, snippet: string}>>}
 */
export async function webSearch(query) {
  if (config.tavilyApiKey) {
    return await tavilySearch(query, config.tavilyApiKey);
  } else {
    return await fallbackSearch(query);
  }
}

/**
 * Tavily Search API Client
 */
async function tavilySearch(query, apiKey) {
  try {
    // Using 'basic' search depth for 10x faster response time.
    // Reducing timeout to 4000ms to failover instantly if Tavily rate-limits or lags.
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      max_results: 5,
      search_depth: 'basic'
    }, { timeout: 4000 });

    if (response.data && response.data.results) {
      return response.data.results.map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.content || r.snippet || ''
      }));
    }
    throw new Error('Invalid response structure from Tavily');
  } catch (error) {
    console.warn(`Tavily search failed: ${error.message}. Falling back to DuckDuckGo...`);
    return await fallbackSearch(query);
  }
}

/**
 * Free fallback search scraping DuckDuckGo HTML search results.
 */
async function fallbackSearch(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 5000
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('.result').each((i, element) => {
      if (i >= 5) return; // Limit to 5 results for speed
      const titleEl = $(element).find('.result__a');
      const snippetEl = $(element).find('.result__snippet');
      
      const title = titleEl.text().trim();
      const rawUrl = titleEl.attr('href');
      const snippet = snippetEl.text().trim();

      if (title && rawUrl) {
        let actualUrl = rawUrl;
        // DuckDuckGo redirects some URLs internally. Let's parse the actual target URL.
        if (rawUrl.includes('uddg=')) {
          try {
            const parts = rawUrl.split('uddg=');
            if (parts[1]) {
              actualUrl = decodeURIComponent(parts[1].split('&')[0]);
            }
          } catch (e) {
            // Keep original rawUrl if decode fails
          }
        }
        results.push({ title, url: actualUrl, snippet });
      }
    });

    return results;
  } catch (error) {
    console.error('DuckDuckGo fallback search error:', error.message);
    return [];
  }
}
