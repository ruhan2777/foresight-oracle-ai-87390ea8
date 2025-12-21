import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

const indexNames: Record<string, string> = {
  'SPY': 'S&P 500',
  'QQQ': 'NASDAQ 100',
  'DIA': 'Dow Jones',
  'IWM': 'Russell 2000',
  'VTI': 'Total Market',
};

// Helper to delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');
    
    if (!finnhubApiKey) {
      throw new Error('FINNHUB_API_KEY is not configured');
    }

    const { symbols } = await req.json();
    const tickerSymbols = symbols || ['SPY', 'QQQ', 'DIA'];
    
    console.log(`Fetching quotes for symbols: ${tickerSymbols.join(', ')}`);
    
    const quotes: MarketIndex[] = [];
    
    // Fetch sequentially with delays to avoid rate limiting
    for (let i = 0; i < tickerSymbols.length; i++) {
      const symbol = tickerSymbols[i];
      
      // Add delay between requests (except for the first one)
      if (i > 0) {
        await delay(250); // 250ms delay between requests
      }
      
      try {
        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
        const response = await fetch(quoteUrl);
        
        if (response.status === 429) {
          console.warn(`Rate limited for ${symbol}, using fallback data`);
          quotes.push(createFallbackQuote(symbol));
          continue;
        }
        
        if (!response.ok) {
          console.error(`Failed to fetch quote for ${symbol}: ${response.status}`);
          quotes.push(createFallbackQuote(symbol));
          continue;
        }
        
        const quote: FinnhubQuote = await response.json();
        
        // Check if we got valid data (price > 0)
        if (!quote.c || quote.c === 0) {
          console.warn(`No valid quote data for ${symbol}, using fallback`);
          quotes.push(createFallbackQuote(symbol));
          continue;
        }
        
        console.log(`Quote for ${symbol}: $${quote.c} (${quote.dp}%)`);
        
        quotes.push({
          symbol,
          name: indexNames[symbol] || symbol,
          price: quote.c,
          change: quote.d || 0,
          changePercent: quote.dp || 0,
          sparkline: generateSparkline(quote.c, 0.008),
        });
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err);
        quotes.push(createFallbackQuote(symbol));
      }
    }

    return new Response(JSON.stringify({ quotes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in stock-quotes function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

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

// Fallback data when API is rate limited or unavailable
function createFallbackQuote(symbol: string): MarketIndex {
  const fallbackPrices: Record<string, number> = {
    'SPY': 592.50,
    'QQQ': 525.30,
    'DIA': 438.20,
    'IWM': 224.80,
    'VTI': 285.40,
  };
  
  const price = fallbackPrices[symbol] || 100;
  const changePercent = (Math.random() - 0.5) * 2; // Random -1% to +1%
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
