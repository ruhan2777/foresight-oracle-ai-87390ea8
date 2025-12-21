import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============= TYPE DEFINITIONS =============

interface NewsItem {
  id: string;
  source: string;
  headline: string;
  summary: string;
  sentiment: number; // -1 to 1
  url: string;
  publishedAt: string;
  relatedSymbols: string[];
}

interface WeightedSentimentResult {
  symbol: string;
  rawSentiment: number;
  weightedSentiment: number;
  articleCount: number;
  topSources: { name: string; weight: number; sentiment: number }[];
  confidence: number;
}

interface SentimentResponse {
  results: WeightedSentimentResult[];
  articles: NewsItem[];
  metadata: {
    totalArticles: number;
    averageSourceWeight: number;
    timestamp: string;
  };
}

// ============= SOURCE RELIABILITY WEIGHTS =============

const SOURCE_WEIGHTS: Record<string, number> = {
  // Tier 1 - Major Financial News (Weight: 1.0)
  'Bloomberg': 1.0,
  'Reuters': 1.0,
  'Wall Street Journal': 1.0,
  'Financial Times': 1.0,
  'CNBC': 0.95,
  
  // Tier 2 - Established Financial Media (Weight: 0.8-0.9)
  'MarketWatch': 0.9,
  'Barrons': 0.9,
  'The Economist': 0.9,
  'Yahoo Finance': 0.85,
  'Investor Business Daily': 0.85,
  'Seeking Alpha': 0.8,
  
  // Tier 3 - General News with Finance Sections (Weight: 0.6-0.75)
  'New York Times': 0.75,
  'Washington Post': 0.75,
  'Associated Press': 0.7,
  'Forbes': 0.7,
  'Business Insider': 0.65,
  'The Motley Fool': 0.6,
  
  // Tier 4 - Aggregators & Social (Weight: 0.3-0.5)
  'Benzinga': 0.5,
  'Zacks': 0.5,
  'TheStreet': 0.45,
  'InvestorPlace': 0.4,
  'Stocktwits': 0.35,
  'Reddit': 0.3,
  
  // Tier 5 - Unknown/Blogs (Weight: 0.1-0.25)
  'Medium': 0.25,
  'Substack': 0.25,
  'Unknown Blog': 0.2,
  'default': 0.15, // Unknown sources
};

// ============= MOCK NEWS DATA GENERATOR =============

function generateMockNewsData(symbols: string[]): NewsItem[] {
  const headlines = [
    { text: 'Fed signals potential rate pause amid cooling inflation', sentiment: 0.4 },
    { text: 'Tech stocks rally on strong earnings reports', sentiment: 0.75 },
    { text: 'Market volatility expected ahead of jobs report', sentiment: -0.2 },
    { text: 'AI investments continue to drive semiconductor demand', sentiment: 0.8 },
    { text: 'Treasury yields fall as bond market sees flight to safety', sentiment: -0.35 },
    { text: 'Analysts upgrade price targets following strong guidance', sentiment: 0.65 },
    { text: 'Supply chain concerns weigh on manufacturing sector', sentiment: -0.45 },
    { text: 'Consumer spending shows resilience despite inflation', sentiment: 0.5 },
    { text: 'Energy stocks decline amid falling oil prices', sentiment: -0.55 },
    { text: 'Healthcare sector sees rotation as defensives gain favor', sentiment: 0.25 },
    { text: 'Crypto volatility spills over into risk assets', sentiment: -0.6 },
    { text: 'Institutional buyers accumulate on market dips', sentiment: 0.55 },
  ];
  
  const sources = Object.keys(SOURCE_WEIGHTS).filter(s => s !== 'default');
  const articles: NewsItem[] = [];
  
  // Generate 8-15 mock articles
  const articleCount = Math.floor(Math.random() * 8) + 8;
  
  for (let i = 0; i < articleCount; i++) {
    const headline = headlines[Math.floor(Math.random() * headlines.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const relatedCount = Math.floor(Math.random() * 3) + 1;
    const relatedSymbols = symbols.slice(0, relatedCount);
    
    // Add some variation to sentiment
    const sentimentVariation = (Math.random() - 0.5) * 0.2;
    
    articles.push({
      id: `news_${Date.now()}_${i}`,
      source,
      headline: headline.text,
      summary: `Analysis and market implications of ${headline.text.toLowerCase()}...`,
      sentiment: Math.max(-1, Math.min(1, headline.sentiment + sentimentVariation)),
      url: `https://example.com/article/${i}`,
      publishedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      relatedSymbols,
    });
  }
  
  return articles;
}

// ============= WEIGHTED SENTIMENT CALCULATION =============

function getSourceWeight(source: string): number {
  return SOURCE_WEIGHTS[source] ?? SOURCE_WEIGHTS['default'];
}

function calculateWeightedSentiment(
  symbol: string,
  articles: NewsItem[]
): WeightedSentimentResult {
  // Filter articles related to this symbol
  const relevantArticles = articles.filter(
    a => a.relatedSymbols.includes(symbol)
  );
  
  if (relevantArticles.length === 0) {
    return {
      symbol,
      rawSentiment: 0,
      weightedSentiment: 0,
      articleCount: 0,
      topSources: [],
      confidence: 0,
    };
  }
  
  // Calculate raw (unweighted) average
  const rawSum = relevantArticles.reduce((sum, a) => sum + a.sentiment, 0);
  const rawSentiment = rawSum / relevantArticles.length;
  
  // Calculate weighted average
  let weightedSum = 0;
  let totalWeight = 0;
  const sourceMap = new Map<string, { weight: number; sentiments: number[] }>();
  
  for (const article of relevantArticles) {
    const weight = getSourceWeight(article.source);
    weightedSum += article.sentiment * weight;
    totalWeight += weight;
    
    // Track by source for top sources
    if (!sourceMap.has(article.source)) {
      sourceMap.set(article.source, { weight, sentiments: [] });
    }
    sourceMap.get(article.source)!.sentiments.push(article.sentiment);
  }
  
  const weightedSentiment = totalWeight > 0 ? weightedSum / totalWeight : 0;
  
  // Calculate confidence based on article count and source diversity
  const sourceCount = sourceMap.size;
  const articleBonus = Math.min(relevantArticles.length / 10, 1);
  const sourceBonus = Math.min(sourceCount / 5, 1);
  const avgWeight = totalWeight / relevantArticles.length;
  const confidence = (articleBonus * 0.3 + sourceBonus * 0.3 + avgWeight * 0.4);
  
  // Get top sources
  const topSources = Array.from(sourceMap.entries())
    .map(([name, data]) => ({
      name,
      weight: data.weight,
      sentiment: data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length,
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);
  
  console.log(`[SENTIMENT] ${symbol}: Raw=${rawSentiment.toFixed(3)}, Weighted=${weightedSentiment.toFixed(3)}, Articles=${relevantArticles.length}, Confidence=${confidence.toFixed(2)}`);
  
  return {
    symbol,
    rawSentiment: Number(rawSentiment.toFixed(4)),
    weightedSentiment: Number(weightedSentiment.toFixed(4)),
    articleCount: relevantArticles.length,
    topSources,
    confidence: Number(confidence.toFixed(2)),
  };
}

// ============= REQUEST HANDLER =============

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json();
    const tickerSymbols = symbols || ['SPY', 'QQQ', 'DIA'];
    
    console.log(`[NEWS-SENTIMENT] Analyzing sentiment for: ${tickerSymbols.join(', ')}`);
    
    // In production, this would fetch from a news API like NewsAPI, Finnhub News, etc.
    // For now, generate mock data that demonstrates the weighting system
    const articles = generateMockNewsData(tickerSymbols);
    
    // Calculate weighted sentiment for each symbol
    const results = tickerSymbols.map((symbol: string) => 
      calculateWeightedSentiment(symbol, articles)
    );
    
    // Calculate metadata
    const totalArticles = articles.length;
    const avgWeight = articles.reduce((sum, a) => sum + getSourceWeight(a.source), 0) / totalArticles;
    
    const response: SentimentResponse = {
      results,
      articles,
      metadata: {
        totalArticles,
        averageSourceWeight: Number(avgWeight.toFixed(3)),
        timestamp: new Date().toISOString(),
      },
    };
    
    console.log(`[NEWS-SENTIMENT] Complete - ${totalArticles} articles analyzed, avg weight: ${avgWeight.toFixed(3)}`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[NEWS-SENTIMENT] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
