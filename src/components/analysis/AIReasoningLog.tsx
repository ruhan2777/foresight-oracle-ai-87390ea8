import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, History, Cpu, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ReasoningEntry {
  id: string;
  timestamp: string;
  signalStrength: number;
  bullishFactors: string[];
  bearishFactors: string[];
  modelVersion: string;
  reasoningText: string;
  backtestData: { day: string; accuracy: number }[];
}

// Generate mock reasoning entries
const generateReasoningEntries = (ticker: string): ReasoningEntry[] => [
  {
    id: '1',
    timestamp: '2 hours ago',
    signalStrength: 87,
    bullishFactors: [
      'High volume on DIA',
      'Positive earnings surprise',
      'Institutional accumulation detected',
      'RSI showing oversold reversal',
    ],
    bearishFactors: [
      'Negative sentiment in NYT',
      'Sector rotation concerns',
    ],
    modelVersion: 'v2.1-Alpha',
    reasoningText: `Price hit resistance at $${(Math.random() * 100 + 400).toFixed(0)} while sentiment dipped 10%, suggesting a short-term pullback. However, strong institutional buying pressure and technical indicators point to a bullish continuation pattern within the next 5-7 trading sessions.`,
    backtestData: [
      { day: 'D-7', accuracy: 78 },
      { day: 'D-6', accuracy: 82 },
      { day: 'D-5', accuracy: 85 },
      { day: 'D-4', accuracy: 79 },
      { day: 'D-3', accuracy: 88 },
      { day: 'D-2', accuracy: 91 },
      { day: 'D-1', accuracy: 89 },
    ],
  },
  {
    id: '2',
    timestamp: '6 hours ago',
    signalStrength: 72,
    bullishFactors: [
      'Breaking news catalyst',
      'Options flow bullish',
    ],
    bearishFactors: [
      'Fed rate concerns',
      'Bond yield inversion',
      'Weak consumer confidence',
    ],
    modelVersion: 'v2.0-Stable',
    reasoningText: `Mixed signals detected. While news catalysts drove initial optimism, macro headwinds including Fed policy uncertainty are weighing on momentum. Model suggests a HOLD position until clearer directional confirmation emerges.`,
    backtestData: [
      { day: 'D-7', accuracy: 71 },
      { day: 'D-6', accuracy: 74 },
      { day: 'D-5', accuracy: 68 },
      { day: 'D-4', accuracy: 75 },
      { day: 'D-3', accuracy: 73 },
      { day: 'D-2', accuracy: 77 },
      { day: 'D-1', accuracy: 72 },
    ],
  },
  {
    id: '3',
    timestamp: '1 day ago',
    signalStrength: 94,
    bullishFactors: [
      'Golden cross on daily chart',
      'Record insider buying',
      'Analyst upgrades (3x)',
      'Strong guidance revision',
      'AI sector momentum',
    ],
    bearishFactors: [
      'Slight overbought RSI',
    ],
    modelVersion: 'v2.1-Alpha',
    reasoningText: `Strong conviction BUY signal. Multiple technical and fundamental factors align with bullish thesis. Price action confirmed breakout above key resistance with volume expansion. Model confidence elevated due to convergence of 5+ bullish indicators.`,
    backtestData: [
      { day: 'D-7', accuracy: 88 },
      { day: 'D-6', accuracy: 91 },
      { day: 'D-5', accuracy: 93 },
      { day: 'D-4', accuracy: 90 },
      { day: 'D-3', accuracy: 94 },
      { day: 'D-2', accuracy: 92 },
      { day: 'D-1', accuracy: 95 },
    ],
  },
];

interface AIReasoningLogProps {
  ticker: string;
}

export function AIReasoningLog({ ticker }: AIReasoningLogProps) {
  const entries = generateReasoningEntries(ticker);
  const [expandedBacktest, setExpandedBacktest] = useState<string | null>(null);

  const toggleBacktest = (id: string) => {
    setExpandedBacktest(expandedBacktest === id ? null : id);
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'text-success';
    if (strength >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (strength: number) => {
    if (strength >= 80) return 'bg-success';
    if (strength >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">AI Reasoning Log</h2>
          <p className="text-sm text-muted-foreground">Model decision timeline for {ticker}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50" />

        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div key={entry.id} className="relative pl-14">
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-4 top-4 w-4 h-4 rounded-full border-2 border-background",
                entry.signalStrength >= 80 ? 'bg-success' : entry.signalStrength >= 60 ? 'bg-warning' : 'bg-destructive'
              )} />

              {/* Glassmorphism card */}
              <div className="relative overflow-hidden rounded-xl border border-border/30 bg-card/40 backdrop-blur-xl">
                {/* Glass overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{entry.timestamp}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-primary/30 bg-primary/10 text-primary font-mono text-xs"
                    >
                      {entry.modelVersion}
                    </Badge>
                  </div>

                  {/* Signal Strength */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Signal Strength</span>
                      <span className={cn("font-mono font-bold", getSignalColor(entry.signalStrength))}>
                        {entry.signalStrength}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-500", getProgressColor(entry.signalStrength))}
                        style={{ width: `${entry.signalStrength}%` }}
                      />
                      {/* Animated glow effect */}
                      <div 
                        className={cn(
                          "absolute top-0 h-full rounded-full blur-sm opacity-50",
                          getProgressColor(entry.signalStrength)
                        )}
                        style={{ width: `${entry.signalStrength}%` }}
                      />
                    </div>
                  </div>

                  {/* Contributing Factors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bullish */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-success">Bullish Drivers</span>
                      </div>
                      <ul className="space-y-1">
                        {entry.bullishFactors.map((factor, i) => (
                          <li 
                            key={i} 
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-success/60" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bearish */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Bearish Drivers</span>
                      </div>
                      <ul className="space-y-1">
                        {entry.bearishFactors.map((factor, i) => (
                          <li 
                            key={i} 
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Reasoning Text */}
                  <div className="p-4 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-sm text-foreground/90 leading-relaxed italic">
                      "{entry.reasoningText}"
                    </p>
                  </div>

                  {/* Backtest Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full border border-border/30 hover:bg-muted/30"
                    onClick={() => toggleBacktest(entry.id)}
                  >
                    <History className="w-4 h-4 mr-2" />
                    Backtest History
                    {expandedBacktest === entry.id ? (
                      <ChevronUp className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    )}
                  </Button>

                  {/* Backtest Chart */}
                  {expandedBacktest === entry.id && (
                    <div className="animate-fade-in pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">7-Day Model Accuracy</span>
                        <span className="text-sm font-mono text-primary">
                          Avg: {(entry.backtestData.reduce((a, b) => a + b.accuracy, 0) / entry.backtestData.length).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-32 -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={entry.backtestData}>
                            <defs>
                              <linearGradient id={`backtestGradient-${entry.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis 
                              dataKey="day" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                            />
                            <YAxis 
                              domain={[60, 100]} 
                              axisLine={false} 
                              tickLine={false}
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                              tickFormatter={(v) => `${v}%`}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                fontSize: '12px',
                              }}
                              formatter={(value: number) => [`${value}%`, 'Accuracy']}
                            />
                            <Area
                              type="monotone"
                              dataKey="accuracy"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              fill={`url(#backtestGradient-${entry.id})`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
