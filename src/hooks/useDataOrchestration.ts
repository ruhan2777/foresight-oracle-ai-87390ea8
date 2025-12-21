import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketIndex } from '@/lib/mockData';

export interface DataAnomaly {
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

export interface DataHealthStatus {
  status: 'GREEN' | 'YELLOW' | 'RED';
  latency: number;
  source: 'PRIMARY' | 'SECONDARY' | 'FALLBACK';
  anomalies: DataAnomaly[];
  lastUpdated: string;
}

export interface SentimentResult {
  symbol: string;
  rawSentiment: number;
  weightedSentiment: number;
  articleCount: number;
  topSources: { name: string; weight: number; sentiment: number }[];
  confidence: number;
}

export interface NewsArticle {
  id: string;
  source: string;
  headline: string;
  summary: string;
  sentiment: number;
  url: string;
  publishedAt: string;
  relatedSymbols: string[];
}

interface UseDataOrchestrationOptions {
  symbols?: string[];
  refreshInterval?: number;
  enableSentiment?: boolean;
}

interface UseDataOrchestrationReturn {
  // Market data
  marketData: MarketIndex[];
  isLoading: boolean;
  error: string | null;
  
  // Data health
  health: DataHealthStatus | null;
  anomalyHistory: DataAnomaly[];
  
  // Sentiment
  sentimentData: SentimentResult[];
  newsArticles: NewsArticle[];
  sentimentMetadata: { totalArticles: number; averageSourceWeight: number; timestamp: string } | null;
  
  // Actions
  refresh: () => Promise<void>;
  clearAnomalies: () => void;
}

export function useDataOrchestration(options: UseDataOrchestrationOptions = {}): UseDataOrchestrationReturn {
  const { 
    symbols: inputSymbols, 
    refreshInterval = 60000,
    enableSentiment = true,
  } = options;

  const symbols = useMemo(() => inputSymbols || ['SPY', 'QQQ', 'DIA'], [inputSymbols]);

  // Market data state
  const [marketData, setMarketData] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Health state
  const [health, setHealth] = useState<DataHealthStatus | null>(null);
  const [anomalyHistory, setAnomalyHistory] = useState<DataAnomaly[]>([]);
  
  // Sentiment state
  const [sentimentData, setSentimentData] = useState<SentimentResult[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [sentimentMetadata, setSentimentMetadata] = useState<{ totalArticles: number; averageSourceWeight: number; timestamp: string } | null>(null);
  
  const isFetching = useRef(false);
  const intervalRef = useRef<number | null>(null);

  const fetchData = useCallback(async () => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    setError(null);
    
    try {
      // Fetch market data from orchestrator
      const { data: orchestratorData, error: orchestratorError } = await supabase.functions.invoke('data-orchestrator', {
        body: { symbols },
      });
      
      if (orchestratorError) throw orchestratorError;
      
      if (orchestratorData?.quotes) {
        setMarketData(orchestratorData.quotes);
      }
      
      if (orchestratorData?.health) {
        setHealth(orchestratorData.health);
        
        // Accumulate anomalies in history
        if (orchestratorData.health.anomalies?.length > 0) {
          setAnomalyHistory(prev => {
            const newAnomalies = orchestratorData.health.anomalies.filter(
              (a: DataAnomaly) => !prev.some(p => p.id === a.id)
            );
            // Keep last 50 anomalies
            return [...newAnomalies, ...prev].slice(0, 50);
          });
        }
      }
      
      // Fetch sentiment data if enabled
      if (enableSentiment) {
        const { data: sentimentResponse, error: sentimentError } = await supabase.functions.invoke('news-sentiment', {
          body: { symbols },
        });
        
        if (!sentimentError && sentimentResponse) {
          setSentimentData(sentimentResponse.results || []);
          setNewsArticles(sentimentResponse.articles || []);
          setSentimentMetadata(sentimentResponse.metadata || null);
        }
      }
      
    } catch (err) {
      console.error('Data orchestration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      
      setHealth({
        status: 'RED',
        latency: 0,
        source: 'FALLBACK',
        anomalies: [],
        lastUpdated: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [symbols, enableSentiment]);

  const clearAnomalies = useCallback(() => {
    setAnomalyHistory([]);
  }, []);

  // Initial fetch and interval setup
  useEffect(() => {
    fetchData();
    
    intervalRef.current = window.setInterval(fetchData, refreshInterval);
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, refreshInterval]);

  return {
    marketData,
    isLoading,
    error,
    health,
    anomalyHistory,
    sentimentData,
    newsArticles,
    sentimentMetadata,
    refresh: fetchData,
    clearAnomalies,
  };
}
