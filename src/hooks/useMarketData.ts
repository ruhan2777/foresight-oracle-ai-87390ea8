import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketIndex } from '@/lib/mockData';

interface UseMarketDataOptions {
  symbols?: string[];
  refreshInterval?: number; // in milliseconds
}

interface UseMarketDataReturn {
  data: MarketIndex[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useMarketData(options: UseMarketDataOptions = {}): UseMarketDataReturn {
  const { 
    symbols = ['SPY', 'QQQ', 'DIA'], 
    refreshInterval = 60000 // Default 1 minute refresh
  } = options;

  const [data, setData] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setError(null);
      
      const { data: response, error: functionError } = await supabase.functions.invoke('stock-quotes', {
        body: { symbols }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (response?.error) {
        throw new Error(response.error);
      }

      if (response?.quotes) {
        setData(response.quotes);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    fetchMarketData();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchMarketData, refreshInterval);

    return () => clearInterval(intervalId);
  }, [fetchMarketData, refreshInterval]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMarketData,
    lastUpdated
  };
}
