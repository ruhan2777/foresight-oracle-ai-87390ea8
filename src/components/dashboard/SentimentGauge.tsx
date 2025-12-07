import { useMemo } from 'react';

interface SentimentGaugeProps {
  value: number; // -1 to 1
}

export function SentimentGauge({ value }: SentimentGaugeProps) {
  const { sentiment, color, percentage, rotation } = useMemo(() => {
    const normalizedValue = Math.max(-1, Math.min(1, value));
    const percentage = ((normalizedValue + 1) / 2) * 100;
    const rotation = normalizedValue * 90; // -90 to 90 degrees
    
    let sentiment: string;
    let color: string;
    
    if (normalizedValue > 0.3) {
      sentiment = 'BULLISH';
      color = 'hsl(var(--success))';
    } else if (normalizedValue < -0.3) {
      sentiment = 'BEARISH';
      color = 'hsl(var(--destructive))';
    } else {
      sentiment = 'NEUTRAL';
      color = 'hsl(var(--warning))';
    }
    
    return { sentiment, color, percentage, rotation };
  }, [value]);

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Market Sentiment</h3>
      
      <div className="relative w-32 h-16 mb-4">
        {/* Gauge background */}
        <svg className="w-full h-full" viewBox="0 0 100 50">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--destructive))" />
              <stop offset="50%" stopColor="hsl(var(--warning))" />
              <stop offset="100%" stopColor="hsl(var(--success))" />
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Colored arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Needle */}
          <g transform={`rotate(${rotation}, 50, 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="5" fill={color} />
          </g>
        </svg>
      </div>
      
      <div
        className="text-xl font-bold mb-1"
        style={{ color }}
      >
        {sentiment}
      </div>
      <div className="text-2xl font-mono font-bold">
        {percentage.toFixed(0)}%
      </div>
    </div>
  );
}
