import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============= TYPE DEFINITIONS =============

interface FinnhubQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High
  l: number;  // Low
  o: number;  // Open
  pc: number; // Previous close
}

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

interface DataHealthStatus {
  status: 'GREEN' | 'YELLOW' | 'RED';
  latency: number;
  source: 'PRIMARY' | 'SECONDARY' | 'FALLBACK';
  anomalies: DataAnomaly[];
  lastUpdated: string;
}

interface DataAnomaly {
  id: string;
  symbol: string;
  type: 'PRICE_SPIKE' | 'STALE_DATA' | 'SOURCE_MISMATCH';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  previousValue: number;
  newValue: number;
  percentChange: number;
  timestamp: string;
}

interface FetchResult {
  success: boolean;
  data: MarketIndex[] | null;
  source: 'PRIMARY' | 'SECONDARY' | 'FALLBACK';
  latency: number;
  error?: string;
}

// ============= CONSTANTS =============

const indexNames: Record<string, string> = {
  'SPY': 'S&P 500',
  'QQQ': 'NASDAQ 100',
  'DIA': 'Dow Jones',
  'IWM': 'Russell 2000',
  'VTI': 'Total Market',
};

// Price validation thresholds
const PRICE_SPIKE_THRESHOLD = 0.20; // 20% change threshold
const STALE_DATA_THRESHOLD_MS = 60000; // 60 seconds

// Latency thresholds for health status
const LATENCY_GREEN_MS = 500;
const LATENCY_YELLOW_MS = 2000;

// In-memory cache for last known prices (per symbol)
const lastKnownPrices: Map<string, { price: number; timestamp: number }> = new Map();

// ============= HELPER FUNCTIONS =============

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function generateSparkline(base: number, volatility: number = 0.02): number[] {
  const points: number[] = [];
  let current = base * 0.995;
  for (let i = 0; i < 24; i++) {
    current = current * (1 + (Math.random() - 0.4) * volatility);
    points.push(current);
  }
  points[points.length - 1] = base;
  return points;
}

function createFallbackQuote(symbol: string): MarketIndex {
  const fallbackPrices: Record<string, number> = {
    'SPY': 680.59,
    'QQQ': 617.05,
    'DIA': 481.15,
    'IWM': 224.80,
    'VTI': 285.40,
  };
  
  const price = fallbackPrices[symbol] || 100;
  const changePercent = (Math.random() - 0.5) * 2;
  const change = price * (changePercent / 100);
  
  return {
    symbol,
    name: indexNames[symbol] || symbol,
    price,
    change,
    changePercent,
    sparkline: generateSparkline(price, 0.008),
  };
}

function generateAnomalyId(): string {
  return `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============= DATA HEALTH SCORING =============

function calculateHealthStatus(latency: number, source: 'PRIMARY' | 'SECONDARY' | 'FALLBACK', anomalyCount: number): 'GREEN' | 'YELLOW' | 'RED' {
  // RED conditions
  if (source === 'FALLBACK' || anomalyCount > 2 || latency > LATENCY_YELLOW_MS) {
    return 'RED';
  }
  
  // YELLOW conditions
  if (source === 'SECONDARY' || anomalyCount > 0 || latency > LATENCY_GREEN_MS) {
    return 'YELLOW';
  }
  
  return 'GREEN';
}

// ============= VALIDATION LAYER =============

function validatePriceData(symbol: string, newPrice: number): DataAnomaly | null {
  const lastKnown = lastKnownPrices.get(symbol);
  const now = Date.now();
  
  if (!lastKnown) {
    // First data point, store it
    lastKnownPrices.set(symbol, { price: newPrice, timestamp: now });
    return null;
  }
  
  const timeDiff = now - lastKnown.timestamp;
  const priceDiff = Math.abs(newPrice - lastKnown.price);
  const percentChange = priceDiff / lastKnown.price;
  
  // Check for price spike (>20% in 60 seconds)
  if (timeDiff <= STALE_DATA_THRESHOLD_MS && percentChange > PRICE_SPIKE_THRESHOLD) {
    console.warn(`DATA ANOMALY: ${symbol} jumped ${(percentChange * 100).toFixed(2)}% in ${timeDiff}ms`);
    
    return {
      id: generateAnomalyId(),
      symbol,
      type: 'PRICE_SPIKE',
      severity: percentChange > 0.5 ? 'HIGH' : percentChange > 0.3 ? 'MEDIUM' : 'LOW',
      message: `${symbol} price jumped ${(percentChange * 100).toFixed(2)}% in ${(timeDiff / 1000).toFixed(1)}s - potential data error`,
      previousValue: lastKnown.price,
      newValue: newPrice,
      percentChange: percentChange * 100,
      timestamp: new Date().toISOString(),
    };
  }
  
  // Update last known price
  lastKnownPrices.set(symbol, { price: newPrice, timestamp: now });
  return null;
}

// ============= MULTI-SOURCE FETCHING =============

async function fetchFromPrimary(symbols: string[], apiKey: string): Promise<FetchResult> {
  const startTime = Date.now();
  const quotes: MarketIndex[] = [];
  
  console.log('[PRIMARY] Attempting Finnhub API fetch...');
  
  try {
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      
      if (i > 0) await delay(250);
      
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
      );
      
      if (response.status === 429 || response.status >= 400) {
        console.error(`[PRIMARY] Error for ${symbol}: HTTP ${response.status}`);
        return {
          success: false,
          data: null,
          source: 'PRIMARY',
          latency: Date.now() - startTime,
          error: `HTTP ${response.status} from Finnhub`,
        };
      }
      
      const quote: FinnhubQuote = await response.json();
      
      if (!quote.c || quote.c === 0) {
        console.warn(`[PRIMARY] No valid data for ${symbol}`);
        return {
          success: false,
          data: null,
          source: 'PRIMARY',
          latency: Date.now() - startTime,
          error: 'Invalid quote data received',
        };
      }
      
      quotes.push({
        symbol,
        name: indexNames[symbol] || symbol,
        price: quote.c,
        change: quote.d || 0,
        changePercent: quote.dp || 0,
        sparkline: generateSparkline(quote.c, 0.008),
      });
      
      console.log(`[PRIMARY] ${symbol}: $${quote.c} (${quote.dp}%)`);
    }
    
    return {
      success: true,
      data: quotes,
      source: 'PRIMARY',
      latency: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[PRIMARY] Fetch failed:', error);
    return {
      success: false,
      data: null,
      source: 'PRIMARY',
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function fetchFromSecondary(symbols: string[]): Promise<FetchResult> {
  const startTime = Date.now();
  
  console.log('[SECONDARY] Attempting secondary mock provider...');
  
  // Simulate a secondary API with realistic-ish data
  // In production, this would call Alpha Vantage, Polygon, etc.
  await delay(100); // Simulate API latency
  
  try {
    const quotes: MarketIndex[] = symbols.map(symbol => {
      // Use last known price with small variation, or fallback
      const lastKnown = lastKnownPrices.get(symbol);
      const basePrice = lastKnown?.price || (
        symbol === 'SPY' ? 680 :
        symbol === 'QQQ' ? 617 :
        symbol === 'DIA' ? 481 : 100
      );
      
      // Add small random variation (-0.5% to +0.5%)
      const variation = (Math.random() - 0.5) * 0.01;
      const price = basePrice * (1 + variation);
      const changePercent = (Math.random() - 0.5) * 2;
      
      console.log(`[SECONDARY] ${symbol}: $${price.toFixed(2)}`);
      
      return {
        symbol,
        name: indexNames[symbol] || symbol,
        price: Number(price.toFixed(2)),
        change: Number((price * changePercent / 100).toFixed(2)),
        changePercent: Number(changePercent.toFixed(4)),
        sparkline: generateSparkline(price, 0.008),
      };
    });
    
    return {
      success: true,
      data: quotes,
      source: 'SECONDARY',
      latency: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[SECONDARY] Fetch failed:', error);
    return {
      success: false,
      data: null,
      source: 'SECONDARY',
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function fetchFromFallback(symbols: string[]): FetchResult {
  console.log('[FALLBACK] Using static fallback data...');
  
  const quotes = symbols.map(symbol => createFallbackQuote(symbol));
  
  return {
    success: true,
    data: quotes,
    source: 'FALLBACK',
    latency: 0,
  };
}

// ============= MAIN ORCHESTRATOR =============

async function orchestrateFetch(symbols: string[]): Promise<{
  quotes: MarketIndex[];
  health: DataHealthStatus;
}> {
  const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');
  const anomalies: DataAnomaly[] = [];
  let result: FetchResult;
  
  // Try primary source (Finnhub)
  if (finnhubApiKey) {
    result = await fetchFromPrimary(symbols, finnhubApiKey);
    
    if (!result.success) {
      console.log('[ORCHESTRATOR] Primary failed, trying secondary...');
      result = await fetchFromSecondary(symbols);
      
      if (!result.success) {
        console.log('[ORCHESTRATOR] Secondary failed, using fallback...');
        result = fetchFromFallback(symbols);
      }
    }
  } else {
    console.warn('[ORCHESTRATOR] No API key, using secondary...');
    result = await fetchFromSecondary(symbols);
    
    if (!result.success) {
      result = fetchFromFallback(symbols);
    }
  }
  
  const quotes = result.data || [];
  
  // Validate each quote for anomalies
  const validatedQuotes: MarketIndex[] = [];
  for (const quote of quotes) {
    const anomaly = validatePriceData(quote.symbol, quote.price);
    
    if (anomaly) {
      anomalies.push(anomaly);
      console.warn(`[VALIDATION] Anomaly detected for ${quote.symbol}, using last known price`);
      
      // Use last known good price instead
      const lastKnown = lastKnownPrices.get(quote.symbol);
      if (lastKnown) {
        validatedQuotes.push({
          ...quote,
          price: lastKnown.price,
        });
      } else {
        validatedQuotes.push(quote);
      }
    } else {
      validatedQuotes.push(quote);
    }
  }
  
  // Calculate health status
  const healthStatus = calculateHealthStatus(result.latency, result.source, anomalies.length);
  
  const health: DataHealthStatus = {
    status: healthStatus,
    latency: result.latency,
    source: result.source,
    anomalies,
    lastUpdated: new Date().toISOString(),
  };
  
  console.log(`[ORCHESTRATOR] Completed - Source: ${result.source}, Status: ${healthStatus}, Latency: ${result.latency}ms, Anomalies: ${anomalies.length}`);
  
  return { quotes: validatedQuotes, health };
}

// ============= REQUEST HANDLER =============

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json();
    const tickerSymbols = symbols || ['SPY', 'QQQ', 'DIA'];
    
    console.log(`[DATA-ORCHESTRATOR] Request for: ${tickerSymbols.join(', ')}`);
    
    const { quotes, health } = await orchestrateFetch(tickerSymbols);

    return new Response(
      JSON.stringify({ quotes, health }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[DATA-ORCHESTRATOR] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        health: {
          status: 'RED',
          latency: 0,
          source: 'FALLBACK',
          anomalies: [],
          lastUpdated: new Date().toISOString(),
        }
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
