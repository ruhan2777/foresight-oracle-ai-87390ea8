import { TrendingUp, TrendingDown } from 'lucide-react';
import { marketIndices } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export function MarketOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {marketIndices.map((index) => {
        const isPositive = index.change >= 0;
        const chartData = index.sparkline.map((value, i) => ({ value, index: i }));

        return (
          <div
            key={index.symbol}
            className="glass-card-hover p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{index.symbol}</span>
                  <span className="text-xs text-muted-foreground">{index.name}</span>
                </div>
                <div className="text-2xl font-mono font-bold mt-1">
                  ${index.price.toFixed(2)}
                </div>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium',
                  isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
