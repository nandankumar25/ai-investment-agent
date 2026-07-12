import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Info, Activity, 
  FileText, AlertTriangle, LineChart, ExternalLink, 
  Award, CheckCircle2, XCircle, Terminal, ArrowRight,
  ShieldCheck, HelpCircle, Briefcase, DollarSign, Rss
} from 'lucide-react';
import './App.css';
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ status: 'offline', mode: 'demo' });
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const terminalEndRef = useRef(null);
  const logIntervalRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendStatus(data);
      } else {
        setBackendStatus({ status: 'offline', mode: 'demo' });
      }
    } catch (e) {
      setBackendStatus({ status: 'offline', mode: 'demo' });
    }
  };

  // Autoscroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Clean intervals
  useEffect(() => {
    return () => {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    };
  }, []);

  const simulateLogs = (companyName) => {
    setLogs([]);
    const simulatedSteps = [
      `Initializing AI agent research graph for "${companyName}"...`,
      `Querying ticker mapping API...`,
      `Yahoo Finance server connection handshake initialized.`,
      `Retrieving corporate profile and sector metadata...`,
      `Fetching current valuation multiples (P/E, EV/EBITDA, P/S)...`,
      `Accessing corporate financial statements...`,
      `Compiling balance sheet ratios and leverage metrics...`,
      `Triggering web search for general business model & moat analysis...`,
      `Scraping recent news wires and financial press releases...`,
      `Analyzing competitive landscape and industry headwinds...`,
      `Evaluating structural risk factors and regulatory liabilities...`,
      `Running LangGraph reasoning loops with LLM model...`,
      `Formulating investment decision matrix...`,
      `Synthesizing final thesis and calculating target score...`
    ];

    let currentStep = 0;
    setLogs([simulatedSteps[0]]);
    
    logIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep < simulatedSteps.length) {
        setLogs(prev => [...prev, simulatedSteps[currentStep]]);
      } else {
        clearInterval(logIntervalRef.current);
      }
    }, 1500);
  };

  const handleSearch = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const searchQuery = forcedQuery || query;
    if (!searchQuery.trim()) {
      setError({ message: 'Company name cannot be empty. Please enter a company to research.', status: 400 });
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setActiveTab('overview');
    
    // Start progress logging animation
    simulateLogs(searchQuery);

    try {
      const res = await fetch(`${API_URL}/api/research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companyName: searchQuery })
      });

      if (logIntervalRef.current) clearInterval(logIntervalRef.current);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.message || data.error || 'Server error occurred';
        throw { status: res.status, message };
      }

      if (data.success === false) {
        throw { status: data.status || 404, message: data.message || 'Company not found' };
      }

      if (data.logs && data.logs.length > 0) {
        setLogs(data.logs);
      } else {
        setLogs(prev => [...prev, 'Completed research successfully.']);
      }

      setResults(data);
      fetchStatus();
    } catch (err) {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
      const summary = typeof err === 'object' ? err.message || 'An error occurred' : err.toString();
      const status = typeof err === 'object' ? err.status : undefined;
      setError({ message: summary, status });
      setLogs(prev => [...prev, `[ERROR] Execution aborted: ${summary}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (company) => {
    setQuery(company);
    handleSearch(null, company);
  };

  // Safe markdown line-renderer helper
  const renderMarkdown = (md) => {
    if (!md) return null;

    const renderInline = (text) => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }
        parts.push(
          <a key={`${match[1]}-${match.index}`} href={match[2]} target="_blank" rel="noopener noreferrer">
            {match[1]}
          </a>
        );
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      if (parts.length === 0) {
        return text;
      }

      return parts;
    };

    const lines = md.split('\n');
    return lines.map((line, idx) => {
      let text = line.trim();

      if (text.startsWith('###')) {
        return <h3 key={idx} className="analysis-h3">{renderInline(text.replace('###', '').trim())}</h3>;
      }
      if (text.startsWith('##')) {
        return <h3 key={idx} className="analysis-h3">{renderInline(text.replace('##', '').trim())}</h3>;
      }
      if (text.startsWith('*') || text.startsWith('-')) {
        return <li key={idx} className="analysis-li">{renderInline(text.substring(1).trim())}</li>;
      }
      if (text === '') {
        return <div key={idx} className="analysis-space" />;
      }

      const boldParts = text.split('**');
      if (boldParts.length > 1) {
        return (
          <p key={idx} className="analysis-p">
            {boldParts.map((part, pIdx) => {
              if (pIdx % 2 === 1) {
                return <strong key={pIdx}>{renderInline(part)}</strong>;
              }
              return renderInline(part);
            })}
          </p>
        );
      }

      return <p key={idx} className="analysis-p">{renderInline(text)}</p>;
    });
  };

  const safeValuation = results?.financials?.valuation || {};
  const safeStrength = results?.financials?.financialStrength || {};
  const safeTrading = results?.financials?.tradingInfo || {};
  const safeProfile = results?.financials?.profile || {};
  const safeTickerInfo = results?.tickerInfo || {};

  const getFactValue = (key, fallback = 'Data unavailable') => safeProfile[key] || safeTickerInfo[key] || fallback;

  const formatOverviewDescription = () => {
    const name = results?.tickerInfo?.name || results?.companyName || 'This company';
    const sector = results?.tickerInfo?.sector || results?.financials?.profile?.sector;
    const industry = results?.tickerInfo?.industry || results?.financials?.profile?.industry;
    const exchange = results?.tickerInfo?.exchange || results?.financials?.profile?.exchange;
    const profileDescription = results?.financials?.profile?.description;

    const hasRealDescription = profileDescription && !profileDescription.toLowerCase().includes('resolved from search') && profileDescription.length > 60;

    if (hasRealDescription) {
      return profileDescription;
    }

    const industryText = industry ? `${industry} industry` : sector ? `${sector} sector` : 'a diversified sector';
    const exchangeText = exchange ? ` It is listed on the ${exchange} exchange.` : '';
    return `${name} operates in the ${industryText}.${exchangeText} The agent evaluated its corporate profile, market position, and recent news flow to provide a clear investment perspective.`;
  };

  const overviewDescription = formatOverviewDescription();

  const normalizeValue = (value) => {
    if (value === null || value === undefined || value === '') return 'Data unavailable';
    const text = String(value).trim();
    if (!text || /^(n\/a|na|resolved from search|unknown)$/i.test(text)) return 'Data unavailable';
    return text;
  };

  const getStatusForMetric = (metric, value) => {
    const normalized = normalizeValue(value);
    if (normalized === 'Data unavailable') return 'weak';
    const num = Number(String(normalized).replace(/[^0-9.-]+/g, ''));

    switch (metric) {
      case 'Market Capitalization':
        return /(T|B)/i.test(normalized) ? 'good' : /(M)/i.test(normalized) ? 'moderate' : 'weak';
      case 'Revenue Growth':
        if (normalized.includes('%')) {
          const pct = parseFloat(normalized);
          return pct >= 15 ? 'good' : pct >= 5 ? 'moderate' : 'weak';
        }
        return 'moderate';
      case 'P/E Ratio':
        return num > 0 ? (num <= 15 ? 'good' : num <= 30 ? 'moderate' : 'weak') : 'weak';
      case 'Profit Margin':
        if (normalized.includes('%')) {
          const pct = parseFloat(normalized);
          return pct >= 20 ? 'good' : pct >= 10 ? 'moderate' : 'weak';
        }
        return 'moderate';
      case 'ROE':
        if (normalized.includes('%')) {
          const pct = parseFloat(normalized);
          return pct >= 15 ? 'good' : pct >= 8 ? 'moderate' : 'weak';
        }
        return 'moderate';
      case 'Free Cash Flow':
        return normalized.startsWith('-') ? 'weak' : 'good';
      case 'Debt to Equity':
        return num >= 0 ? (num < 1 ? 'good' : num <= 2 ? 'moderate' : 'weak') : 'weak';
      case 'Dividend Yield':
        if (normalized.includes('%')) {
          const pct = parseFloat(normalized);
          return pct >= 3 ? 'good' : pct >= 1.5 ? 'moderate' : 'weak';
        }
        return 'weak';
      case '52 Week High':
      case '52 Week Low':
        return normalized === 'Data unavailable' ? 'weak' : 'good';
      default:
        return 'moderate';
    }
  };

  const formatMetric = (value) => normalizeValue(value);

  const financialCards = [
    { label: 'Market Capitalization', value: formatMetric(safeValuation.marketCap) },
    { label: 'Revenue (TTM)', value: formatMetric(safeStrength.totalRevenue) },
    { label: 'Revenue Growth', value: formatMetric(safeStrength.revenueGrowth) },
    { label: 'P/E Ratio', value: formatMetric(safeValuation.trailingPE) },
    { label: 'Profit Margin', value: formatMetric(safeStrength.profitMargin) },
    { label: 'ROE', value: formatMetric(safeStrength.returnOnEquity) },
    { label: 'Free Cash Flow', value: formatMetric(safeStrength.freeCashflow) },
    { label: 'Debt to Equity', value: formatMetric(safeStrength.debtToEquity) },
    { label: 'Dividend Yield', value: formatMetric(safeTrading.dividendYield) },
    { label: '52 Week High', value: formatMetric(safeTrading.fiftyTwoWeekHigh) },
    { label: '52 Week Low', value: formatMetric(safeTrading.fiftyTwoWeekLow) }
  ].map((item) => ({
    ...item,
    status: getStatusForMetric(item.label, item.value)
  }));

  const statusIcons = {
    good: '🟢',
    moderate: '🟡',
    weak: '🔴'
  };

  const getAnalysisHighlights = () => {
    const analysisText = results?.analysis || '';
    return analysisText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('*'))
      .slice(0, 4)
      .map(line => line.replace(/^\*+\s*/, '').trim());
  };

  const getCompetitiveSummary = () => {
    if (results?.searchResults?.length) {
      return results.searchResults[0].snippet || 'Competitor and market positioning summarized from available research results.';
    }
    if (results?.analysis) {
      const found = results.analysis
        .split('\n')
        .find(line => /competitor|headwind|moat|landscape/i.test(line));
      return found ? found.replace(/^\*+\s*/, '').trim() : 'Competitor and competitive landscape details are currently being inferred from the analysis.';
    }
    return 'No competitive summary available for this company.';
  };

  const overviewHighlights = getAnalysisHighlights();
  const competitiveSummary = getCompetitiveSummary();
  const topHeadlines = results?.newsResults?.slice(0, 3) || [];

  const highlightBullets = results?.decision?.thesis?.slice(0, 4) || overviewHighlights;
  const sourceList = [
    ...(results?.searchResults?.slice(0, 2) || []).map(item => ({ title: item.title || item.snippet || 'Research source', url: item.url || '#' })),
    ...(results?.newsResults?.slice(0, 2) || []).map(item => ({ title: item.title || item.snippet || 'News source', url: item.url || '#' }))
  ].slice(0, 4);

  const riskLevel = () => {
    const rating = String(results?.decision?.rating || '').toLowerCase();
    if (rating.includes('bear') || rating.includes('pass')) return 'Medium';
    if (rating.includes('neutral') || rating.includes('hold')) return 'Medium';
    if (rating.includes('bull') || rating.includes('invest')) return 'Medium';
    return 'Medium';
  };

  // SVG Gauge computation
  const score = results?.decision?.score || 0;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const investmentSnapshot = [
    { label: 'Recommendation', value: normalizeValue(results?.decision?.recommendation) },
    { label: 'Confidence', value: `${score}/100` },
    { label: 'Risk', value: normalizeValue(riskLevel()) }
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <Activity className="logo-icon" size={32} />
          <div className="logo-text">
            <h1>AI Investment Research Agent</h1>
            <p>Autonomous Equity Intelligence Platform</p>
          </div>
        </div>
        
        <div className="status-badge" onClick={fetchStatus} style={{ cursor: 'pointer' }} title="Click to refresh connection">
          <span className={`status-dot ${backendStatus.status === 'offline' ? '' : backendStatus.mode}`} />
          <span>
            {backendStatus.status === 'offline' 
              ? 'Backend: Offline' 
              : `Backend: Connected (${backendStatus.mode === 'live' ? 'Live API Agent' : 'Mock Demo Mode'})`}
          </span>
        </div>
      </header>

      {/* Main Search Panel */}
      <section className="search-container">
        <h2 className="search-title">Company Research Console</h2>
        <p className="search-subtitle">Enter any public or private company to run a full AI-powered investment analysis.</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon-inside" size={20} />
            <input 
              type="text" 
              placeholder="e.g. Apple, Nvidia, Tesla, Stripe, SpaceX..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="search-input"
              disabled={loading}
            />
          </div>
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Researching...' : 'Dispatch Agent'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="quick-tags">
          <span className="quick-tags-label">Quick Search:</span>
          <button onClick={() => handleQuickSearch('Apple')} className="tag-btn" disabled={loading}>Apple (AAPL)</button>
          <button onClick={() => handleQuickSearch('Tesla')} className="tag-btn" disabled={loading}>Tesla (TSLA)</button>
          <button onClick={() => handleQuickSearch('Nvidia')} className="tag-btn" disabled={loading}>Nvidia (NVDA)</button>
          <button onClick={() => handleQuickSearch('Stripe')} className="tag-btn" disabled={loading}>Stripe (Private)</button>
        </div>
      </section>

      {/* Error State */}
      {error?.status === 404 ? (
        <section className="not-found-card">
          <div className="not-found-header">
            <XCircle size={36} />
            <div>
              <h3>Company Not Found</h3>
              <p>We couldn't find reliable information for:</p>
              <p className="not-found-query">"{query.trim()}"</p>
            </div>
          </div>

          <p className="not-found-copy">Please check the spelling or search for a publicly known company.</p>
          <div className="not-found-examples">
            <span>Examples:</span>
            <ul>
              <li>Apple</li>
              <li>Tesla</li>
              <li>Microsoft</li>
              <li>NVIDIA</li>
              <li>Infosys</li>
            </ul>
          </div>
        </section>
      ) : error ? (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#F87171',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Research Dispatch Failed</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{error.message || error}</p>
          </div>
        </div>
      ) : null}

      {/* Loading Terminal Log view */}
      {loading && (
        <section className="loading-card">
          <div className="loader-animation">
            <div className="loader-ring"></div>
            <div className="loader-ring-inner"></div>
            <Terminal className="loader-icon" size={36} />
          </div>
          <h3 className="loading-text">Research Agent Active</h3>
          <p className="loading-sub">Traversing LangGraph node graph & scraping financial networks...</p>
          
          <div className="terminal-console">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="t-dot r"></span>
                <span className="t-dot y"></span>
                <span className="t-dot g"></span>
              </div>
              <span className="terminal-title">Agent Audit Log Console</span>
            </div>
            {logs.map((log, index) => (
              <div key={index} className={`terminal-line ${log.startsWith('[ERROR]') ? 'danger' : log.includes('Success') || log.includes('Resolved') ? 'success' : 'info'}`}>
                &gt; {log}
              </div>
            ))}
            <div className="terminal-cursor"></div>
            <div ref={terminalEndRef} />
          </div>
        </section>
      )}

      {/* Results Dashboard */}
      {results && !loading && (
        <section className="dashboard-grid">
          {/* Recommendation Banner */}
          <div className={`recommendation-card ${results.decision.recommendation.toLowerCase()}`}>
            <div className="rec-left">
              <div className="rec-badge-icon">
                {results.decision.recommendation === 'INVEST' 
                  ? <ShieldCheck size={44} /> 
                  : <XCircle size={44} />
                }
              </div>
              <div className="rec-details">
                <h2>{results.decision.recommendation}</h2>
                <div className="rec-company">{results.companyName} {results.ticker ? `(${results.ticker})` : ''}</div>
                <div className="rec-rating">
                  <span>Rating:</span>
                  <span className="rating-pill">{results.decision.rating}</span>
                </div>
              </div>
            </div>

            <div className="score-gauge-container">
              <div className="score-text">
                <div className="score-num">{score}</div>
                <div className="score-label">Decision Score</div>
              </div>
              <svg width="86" height="86" className="gauge-svg">
                <circle className="gauge-bg" cx="43" cy="43" r={radius} strokeWidth="6" />
                <circle 
                  className="gauge-fill" 
                  cx="43" 
                  cy="43" 
                  r={radius} 
                  strokeWidth="6" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="tabs-navigation">
            <button className={`tab-btn-nav ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <Briefcase size={16} /> Overview
            </button>
            <button className={`tab-btn-nav ${activeTab === 'thesis' ? 'active' : ''}`} onClick={() => setActiveTab('thesis')}>
              <Award size={16} /> Investment Thesis
            </button>
            <button className={`tab-btn-nav ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
              <FileText size={16} /> Qualitative Analysis
            </button>
            <button className={`tab-btn-nav ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
              <Rss size={16} /> News & Sentiment
            </button>
          </nav>

          {/* Tab Panels */}
          <div className="tab-panel">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="panel-title">Overview & Investment Dashboard</h3>
                <div className="overview-hero simple-hero">
                  <div>
                    <h2 className="overview-company-title">
                      {results.companyName} {results.ticker ? `(${results.ticker})` : ''}
                    </h2>
                    <p className="overview-subtitle">
                      {safeProfile.industry || results.tickerInfo?.industry || 'Industry unavailable'} | {safeProfile.sector || results.tickerInfo?.sector || 'Sector unavailable'}
                    </p>
                  </div>
                  <div className={`overview-score-card compact-score-card ${results.decision?.recommendation === 'INVEST' ? 'invest' : 'pass'}`}>
                    <div className="overview-score-label">Decision Confidence</div>
                    <div className="overview-score-value">{score}<span className="overview-score-unit">/100</span></div>
                    <div className="score-ring-wrapper">
                      <svg width="90" height="90" className="gauge-svg">
                        <circle className="gauge-bg" cx="45" cy="45" r={radius} strokeWidth="8" />
                        <circle
                          className="gauge-fill"
                          cx="45"
                          cy="45"
                          r={radius}
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className={`overview-score-tag ${results.decision?.recommendation === 'INVEST' ? 'invest' : 'pass'}`}>
                      {results.decision?.recommendation || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="overview-summary-card">
                  <div className="overview-summary-header">
                    <div>
                      <h4>Business Summary</h4>
                      <p>{overviewDescription}</p>
                    </div>
                    <div className="overview-status-pill">{results.decision?.recommendation === 'INVEST' ? '✅ Invest' : '⚠️ Pass'}</div>
                  </div>

                  <div className="overview-card-block">
                    <div className="overview-card-section snapshot-panel">
                      <h5>Investment Snapshot</h5>
                      {investmentSnapshot.map((item, idx) => (
                        <div key={idx} className="snapshot-row">
                          <span>{item.label}</span>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="overview-card-block">
                    <div className="overview-card-section full-width">
                      <h5>Business Highlights</h5>
                      <ul className="highlight-list">
                        {highlightBullets.length > 0 ? highlightBullets.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        )) : (
                          <li>No highlights available yet.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="overview-card-block">
                    <div className="overview-card-section full-width">
                      <h5>Sources</h5>
                      <div className="source-links">
                        {sourceList.length > 0 ? sourceList.map((source, idx) => (
                          <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                        )) : (
                          <span className="text-muted">No source links available.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. THESIS TAB */}
            {activeTab === 'thesis' && (
              <div>
                <h3 className="panel-title">Investment Thesis & Risks</h3>
                <div className="thesis-columns">
                  <div className="thesis-column-box">
                    <h4 className="thesis-column-title bull">
                      <TrendingUp size={20} /> Bull Case / Thesis
                    </h4>
                    <ul className="thesis-list">
                      {results.decision.thesis.map((item, idx) => (
                        <li key={idx} className="thesis-item bull-item">
                          <CheckCircle2 className="thesis-item-icon" size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="thesis-column-box">
                    <h4 className="thesis-column-title bear">
                      <TrendingDown size={20} /> Risk Factors
                    </h4>
                    <ul className="thesis-list">
                      {results.decision.keyRisks.map((item, idx) => (
                        <li key={idx} className="thesis-item bear-item">
                          <AlertTriangle className="thesis-item-icon" size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="reasoning-box">
                  <h4 className="reasoning-title">Detailed Executive Summary</h4>
                  <p className="reasoning-text">{results.decision.reasoning}</p>
                </div>
              </div>
            )}

            {/* 4. QUALITATIVE ANALYSIS TAB */}
            {activeTab === 'analysis' && (
              <div>
                <h3 className="panel-title">Qualitative Analysis Report</h3>
                <div className="analysis-markdown">
                  {renderMarkdown(results.analysis)}
                </div>
              </div>
            )}

            {/* 5. NEWS & SENTIMENT TAB */}
            {activeTab === 'news' && (
              <div>
                <h3 className="panel-title">Recent News & Context</h3>
                {results.newsResults.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No recent news articles were fetched for this company.</p>
                ) : (
                  <div className="news-grid">
                    {results.newsResults.map((news, idx) => (
                      <div key={idx} className="news-card">
                        <div>
                          <h4 className="news-card-title">{news.title}</h4>
                          <p className="news-card-snippet">{news.snippet}</p>
                        </div>
                        {news.url && (
                          <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-card-link">
                            View Article Source <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      )}
    </div>
  );
}
