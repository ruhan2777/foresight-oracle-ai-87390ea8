import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Search, TrendingUp, TrendingDown, Target, Shield, Clock, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { topPredictions } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';

// Generate mock price data
const generatePriceData = (basePrice: number, days: number) => {
  const data = [];
  let price = basePrice * 0.92;
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.48) * 5;
    price = Math.max(price * 0.95, Math.min(price * 1.05, price + change));
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: price,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    });
  }
  return data;
};

const Analysis = () => {
  const [searchParams] = useSearchParams();
  const initialTicker = searchParams.get('ticker') || 'NVDA';
  const [searchTicker, setSearchTicker] = useState(initialTicker);
  const [activeTicker, setActiveTicker] = useState(initialTicker);

  const prediction = topPredictions.find(p => p.ticker === activeTicker) || topPredictions[0];
  const priceData = generatePriceData(prediction.currentPrice, 30);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTicker(searchTicker.toUpperCase());
  };

  const actionConfig = {
    BUY: { color: 'text-success', bg: 'bg-success/10', icon: TrendingUp },
    SELL: { color: 'text-destructive', bg: 'bg-destructive/10', icon: TrendingDown },
    HOLD: { color: 'text-warning', bg: 'bg-warning/10', icon: TrendingDown },
  };

  const config = actionConfig[prediction.action];
  const ActionIcon = config.icon;

  // Technical indicators mock data
  const rsiValue = 42;
  const macdData = [
    { date: 'D-7', macd: -2.1, signal: -1.8 },
    { date: 'D-6', macd: -1.5, signal: -1.6 },
    { date: 'D-5', macd: -0.8, signal: -1.2 },
    { date: 'D-4', macd: 0.2, signal: -0.6 },
    { date: 'D-3', macd: 0.9, signal: 0.1 },
    { date: 'D-2', macd: 1.4, signal: 0.7 },
    { date: 'D-1', macd: 1.8, signal: 1.2 },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter ticker symbol (e.g., AAPL, TSLA)"
              value={searchTicker}
              onChange={(e) => setSearchTicker(e.target.value)}
              className="pl-10 bg-card border-border/50 focus:border-primary"
            />
          </div>
          <Button type="submit" className="btn-gradient">
            Analyze
          </Button>
        </form>

        {/* Stock Header */}
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{prediction.ticker}</h1>
                <span className={cn('px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5', config.bg, config.color)}>
                  <ActionIcon className="w-4 h-4" />
                  {prediction.action}
                </span>
              </div>
              <p className="text-muted-foreground">{prediction.company}</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="text-3xl font-mono font-bold">${prediction.currentPrice.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Target Price</div>
                <div className={cn('text-3xl font-mono font-bold', config.color)}>
                  ${prediction.targetPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Price History</h2>
            <div className="flex gap-2">
              {['1D', '5D', '1M', '3M', '6M', '1Y'].map((range) => (
                <button
                  key={range}
                  className={cn(
                    'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                    range === '1M' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Prediction Card */}
        <div className="glass-card p-6 gradient-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">AI Prediction Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Score Circle */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeDasharray={`${prediction.confidence * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-mono font-bold">{(prediction.confidence * 100).toFixed(0)}</span>
                  <span className="text-xs text-muted-foreground">Score</span>
                </div>
              </div>
            </div>

            {/* Price Targets */}
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-success/10 text-center">
                <div className="text-xs text-muted-foreground mb-1">Bull Case</div>
                <div className="text-xl font-mono font-bold text-success">
                  ${(prediction.targetPrice * 1.1).toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">35% prob</div>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 text-center">
                <div className="text-xs text-muted-foreground mb-1">Base Case</div>
                <div className="text-xl font-mono font-bold text-primary">
                  ${prediction.targetPrice.toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">50% prob</div>
              </div>
              <div className="p-4 rounded-xl bg-destructive/10 text-center">
                <div className="text-xs text-muted-foreground mb-1">Bear Case</div>
                <div className="text-xl font-mono font-bold text-destructive">
                  ${(prediction.targetPrice * 0.9).toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">15% prob</div>
              </div>
            </div>

            {/* Key Levels */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-success" />
                  <span className="text-sm">Entry</span>
                </div>
                <span className="font-mono font-bold">${(prediction.currentPrice * 0.98).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-destructive" />
                  <span className="text-sm">Stop Loss</span>
                </div>
                <span className="font-mono font-bold">${prediction.stopLoss.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm">Timeframe</span>
                </div>
                <span className="font-mono font-bold">{prediction.timeframeDays} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Factor Analysis Tabs */}
        <Tabs defaultValue="technical" className="space-y-4">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="patterns">Historical Patterns</TabsTrigger>
            <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          </TabsList>

          <TabsContent value="technical" className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RSI Gauge */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">RSI (14)</h3>
                <div className="relative h-8 bg-muted rounded-full overflow-hidden mb-2">
                  <div className="absolute inset-y-0 left-0 w-[30%] bg-success/30" />
                  <div className="absolute inset-y-0 left-[30%] w-[40%] bg-muted" />
                  <div className="absolute inset-y-0 right-0 w-[30%] bg-destructive/30" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background"
                    style={{ left: `${rsiValue}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Oversold (0-30)</span>
                  <span className="font-mono font-bold text-foreground">{rsiValue}</span>
                  <span>Overbought (70-100)</span>
                </div>
              </div>

              {/* MACD Chart */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">MACD</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={macdData}>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line type="monotone" dataKey="macd" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="signal" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Signals Summary */}
              <div className="col-span-full">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Technical Signals</h3>
                <div className="flex flex-wrap gap-2">
                  {prediction.signals.technical.map((signal, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                      {signal}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 rounded-full bg-success/10 text-success text-sm">
                    7 bullish signals
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm">
                    2 bearish signals
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Overall Sentiment Score</h3>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-mono font-bold text-success">+0.78</div>
                  <div className="text-sm text-muted-foreground">
                    Strongly Positive<br />
                    <span className="text-success">Bullish consensus</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Analyst Consensus</h3>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 h-4 bg-success rounded-l-full" style={{ width: '65%' }} />
                  <div className="flex-1 h-4 bg-warning" style={{ width: '25%' }} />
                  <div className="flex-1 h-4 bg-destructive rounded-r-full" style={{ width: '10%' }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>13 Buy</span>
                  <span>5 Hold</span>
                  <span>2 Sell</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="glass-card p-6">
            {prediction.signals.pattern && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{prediction.signals.pattern.name}</h3>
                      <p className="text-sm text-muted-foreground">Pattern detected in current market conditions</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-mono">
                      {(prediction.signals.pattern.similarity * 100).toFixed(0)}% match
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-success">
                    {prediction.signals.pattern.historicalImpact}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="fundamentals" className="glass-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'P/E Ratio', value: '32.5', vs: '+15% vs sector' },
                { label: 'Market Cap', value: '$2.1T', vs: 'Mega Cap' },
                { label: 'EPS', value: '$12.84', vs: '+28% YoY' },
                { label: 'ROE', value: '45.2%', vs: 'Excellent' },
              ].map((metric) => (
                <div key={metric.label} className="p-4 rounded-xl bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                  <div className="text-xl font-mono font-bold">{metric.value}</div>
                  <div className="text-xs text-primary">{metric.vs}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Risk Assessment */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className={cn('w-5 h-5', prediction.riskLevel === 'HIGH' ? 'text-destructive' : prediction.riskLevel === 'MEDIUM' ? 'text-warning' : 'text-success')} />
            <h2 className="text-lg font-semibold">Risk Assessment: {prediction.riskLevel}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">Max Drawdown Risk</div>
              <div className="text-xl font-mono font-bold">-{((prediction.currentPrice - prediction.stopLoss) / prediction.currentPrice * 100).toFixed(1)}%</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">Volatility (30d)</div>
              <div className="text-xl font-mono font-bold">Medium</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">Suggested Position</div>
              <div className="text-xl font-mono font-bold">2-3% of portfolio</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
