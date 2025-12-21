import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketIndex } from '@/lib/mockData';

interface UseMarketDataOptions {
  symbols?: string[];
  refreshInterval?: number;
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
    symbols: inputSymbols, 
    refreshInterval = 60000
  } = options;

  // Memoize symbols to prevent unnecessary re-renders
  const symbols = useMemo(() => inputSymbols || ['SPY', 'QQQ', 'DIA'], [inputSymbols]);

  const [data, setData] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Prevent duplicate requests
  const isFetching = useRef(false);
  const hasFetched = useRef(false);

  const fetchMarketData = useCallback(async () => {
    // Prevent concurrent requests
    if (isFetching.current) {
      return;
    }
    
    isFetching.current = true;
    
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
      isFetching.current = false;
    }
  }, [symbols]);

  useEffect(() => {
    // Only fetch once on mount
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchMarketData();
    }

    // Set up polling for updates
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
