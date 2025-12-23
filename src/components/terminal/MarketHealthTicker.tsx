import { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const mockIndices: MarketIndex[] = [
  { symbol: 'SPY', name: 'S&P 500', price: 582.45, change: 3.21, changePercent: 0.55 },
  { symbol: 'QQQ', name: 'NASDAQ', price: 498.32, change: -1.45, changePercent: -0.29 },
  { symbol: 'DIA', name: 'DOW', price: 423.18, change: 2.87, changePercent: 0.68 },
  { symbol: 'IWM', name: 'Russell', price: 198.76, change: -0.34, changePercent: -0.17 },
  { symbol: 'VIX', name: 'Volatility', price: 14.32, change: -0.89, changePercent: -5.85 },
];

export function MarketHealthTicker() {
  const [indices, setIndices] = useState(mockIndices);
  const [systemHealth, setSystemHealth] = useState<'GREEN' | 'YELLOW' | 'RED'>('GREEN');

  // Simulate minor price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(index => ({
        ...index,
        price: index.price + (Math.random() - 0.5) * 0.1,
        change: index.change + (Math.random() - 0.5) * 0.05,
        changePercent: index.changePercent + (Math.random() - 0.5) * 0.02,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = () => {
    switch (systemHealth) {
      case 'GREEN': return 'text-success bg-success/10 border-success/30';
      case 'YELLOW': return 'text-warning bg-warning/10 border-warning/30';
      case 'RED': return 'text-destructive bg-destructive/10 border-destructive/30';
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      {/* System Health Indicator */}
      <div className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium',
        getHealthColor()
      )}>
        <Activity className="w-3 h-3" />
        <span>SYS</span>
        <div className={cn(
          'w-2 h-2 rounded-full',
          systemHealth === 'GREEN' && 'bg-success animate-pulse',
          systemHealth === 'YELLOW' && 'bg-warning animate-pulse',
          systemHealth === 'RED' && 'bg-destructive animate-pulse'
        )} />
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Market Indices Ticker */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin">
        {indices.map((index) => {
          const isPositive = index.changePercent >= 0;
          const isNeutral = Math.abs(index.changePercent) < 0.05;
          
          return (
            <div key={index.symbol} className="flex items-center gap-2 text-xs whitespace-nowrap">
              <span className="font-mono font-bold text-foreground">{index.symbol}</span>
              <span className="font-mono text-muted-foreground">
                {index.price.toFixed(2)}
              </span>
              <div className={cn(
                'flex items-center gap-0.5 font-mono',
                isNeutral ? 'text-muted-foreground' : isPositive ? 'text-success' : 'text-destructive'
              )}>
                {isNeutral ? (
                  <Minus className="w-3 h-3" />
                ) : isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-4 w-px bg-border ml-auto" />

      {/* AI Status */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20 text-xs">
        <Zap className="w-3 h-3 text-primary" />
        <span className="font-medium text-primary">AI Online</span>
      </div>

      {/* Data Integrity */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 border border-border text-xs">
        <Shield className="w-3 h-3 text-muted-foreground" />
        <span className="text-muted-foreground">Verified</span>
      </div>
    </div>
  );
}
