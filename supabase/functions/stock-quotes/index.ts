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
    
    // Default market indices symbols
    const tickerSymbols = symbols || ['SPY', 'QQQ', 'DIA'];
    
    console.log(`Fetching quotes for symbols: ${tickerSymbols.join(', ')}`);
    
    const quotes: MarketIndex[] = await Promise.all(
      tickerSymbols.map(async (symbol: string) => {
        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
        
        const response = await fetch(quoteUrl);
        
        if (!response.ok) {
          console.error(`Failed to fetch quote for ${symbol}: ${response.status}`);
          throw new Error(`Failed to fetch quote for ${symbol}`);
        }
        
        const quote: FinnhubQuote = await response.json();
        
        console.log(`Quote for ${symbol}:`, quote);
        
        // Generate sparkline based on current price with realistic volatility
        const sparkline = generateSparkline(quote.c, 0.008);
        
        const indexNames: Record<string, string> = {
          'SPY': 'S&P 500',
          'QQQ': 'NASDAQ 100',
          'DIA': 'Dow Jones',
          'IWM': 'Russell 2000',
          'VTI': 'Total Market',
        };
        
        return {
          symbol,
          name: indexNames[symbol] || symbol,
          price: quote.c || 0,
          change: quote.d || 0,
          changePercent: quote.dp || 0,
          sparkline,
        };
      })
    );

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
  let current = base * 0.995; // Start slightly lower to simulate day's movement
  for (let i = 0; i < 24; i++) {
    current = current * (1 + (Math.random() - 0.4) * volatility); // Slight upward bias for visualization
    points.push(current);
  }
  // Ensure last point is close to current price
  points[points.length - 1] = base;
  return points;
}
