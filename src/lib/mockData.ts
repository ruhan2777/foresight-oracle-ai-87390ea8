// Mock data for the AI Stock Monitoring System

export interface Prediction {
  id: string;
  ticker: string;
  company: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  currentPrice: number;
  targetPrice: number;
  stopLoss: number;
  predictedChange: number;
  timeframeDays: number;
  createdAt: string;
  targetDate: string;
  status: 'pending' | 'successful' | 'failed';
  signals: {
    technical: string[];
    sentiment: string;
    news: string[];
    pattern?: {
      name: string;
      similarity: number;
      historicalImpact: string;
    };
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface Alert {
  id: string;
  ticker: string;
  type: 'breaking' | 'price' | 'news' | 'prediction';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface HistoricalEvent {
  id: string;
  eventType: string;
  eventDate: string;
  title: string;
  description: string;
  severityLevel: number;
  affectedSectors: string[];
  affectedCompanies: string[];
  marketImpact: {
    immediate: Record<string, number>;
    day30: Record<string, number>;
  };
  patternReliability: number;
  recoveryDays: number;
}

export interface SystemStats {
  accuracyRate: number;
  predictionsToday: number;
  modelVersion: string;
  learningStatus: 'ACTIVE' | 'PAUSED' | 'TRAINING';
  weeklyAccuracy: number[];
  factorPerformance: {
    technical: { accuracy: number; weight: number };
    sentiment: { accuracy: number; weight: number };
    eventPattern: { accuracy: number; weight: number };
    fundamental: { accuracy: number; weight: number };
  };
}

// Generate sparkline data
const generateSparkline = (base: number, volatility: number = 0.02): number[] => {
  const points: number[] = [];
  let current = base;
  for (let i = 0; i < 24; i++) {
    current = current * (1 + (Math.random() - 0.5) * volatility);
    points.push(current);
  }
  return points;
};

export const marketIndices: MarketIndex[] = [
  {
    symbol: 'SPY',
    name: 'S&P 500',
    price: 478.25,
    change: 4.82,
    changePercent: 1.02,
    sparkline: generateSparkline(478, 0.008),
  },
  {
    symbol: 'QQQ',
    name: 'NASDAQ',
    price: 412.67,
    change: 6.34,
    changePercent: 1.56,
    sparkline: generateSparkline(412, 0.012),
  },
  {
    symbol: 'DIA',
    name: 'Dow Jones',
    price: 382.15,
    change: -1.23,
    changePercent: -0.32,
    sparkline: generateSparkline(382, 0.006),
  },
];

export const topPredictions: Prediction[] = [
  {
    id: 'pred_001',
    ticker: 'NVDA',
    company: 'NVIDIA Corporation',
    action: 'BUY',
    confidence: 0.89,
    currentPrice: 875.50,
    targetPrice: 950.00,
    stopLoss: 840.00,
    predictedChange: 8.5,
    timeframeDays: 5,
    createdAt: new Date().toISOString(),
    targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    signals: {
      technical: ['RSI at 42 (neutral-bullish)', 'MACD bullish crossover', 'Above 50-day SMA'],
      sentiment: 'Strongly positive (0.82)',
      news: ['New AI chip announcement', 'Data center revenue surge'],
      pattern: {
        name: 'Similar to Q4 2023 rally',
        similarity: 0.87,
        historicalImpact: '+12.3% in 7 days',
      },
    },
    riskLevel: 'MEDIUM',
  },
  {
    id: 'pred_002',
    ticker: 'AAPL',
    company: 'Apple Inc.',
    action: 'HOLD',
    confidence: 0.72,
    currentPrice: 185.50,
    targetPrice: 188.00,
    stopLoss: 180.00,
    predictedChange: 1.3,
    timeframeDays: 7,
    createdAt: new Date().toISOString(),
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    signals: {
      technical: ['RSI at 55 (neutral)', 'Trading in consolidation range'],
      sentiment: 'Neutral (0.12)',
      news: ['Vision Pro sales mixed', 'iPhone demand steady'],
    },
    riskLevel: 'LOW',
  },
  {
    id: 'pred_003',
    ticker: 'TSLA',
    company: 'Tesla, Inc.',
    action: 'SELL',
    confidence: 0.78,
    currentPrice: 248.75,
    targetPrice: 225.00,
    stopLoss: 260.00,
    predictedChange: -9.5,
    timeframeDays: 10,
    createdAt: new Date().toISOString(),
    targetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    signals: {
      technical: ['RSI overbought (72)', 'Bearish divergence forming', 'Resistance at $250'],
      sentiment: 'Negative (-0.45)',
      news: ['Competition intensifying', 'Margin pressure concerns'],
      pattern: {
        name: 'Similar to Jan 2024 correction',
        similarity: 0.76,
        historicalImpact: '-14.2% in 12 days',
      },
    },
    riskLevel: 'HIGH',
  },
  {
    id: 'pred_004',
    ticker: 'MSFT',
    company: 'Microsoft Corporation',
    action: 'BUY',
    confidence: 0.85,
    currentPrice: 415.20,
    targetPrice: 445.00,
    stopLoss: 400.00,
    predictedChange: 7.2,
    timeframeDays: 14,
    createdAt: new Date().toISOString(),
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    signals: {
      technical: ['Golden cross forming', 'Strong volume support', 'Breakout from channel'],
      sentiment: 'Very positive (0.78)',
      news: ['Azure growth accelerating', 'Copilot adoption surging'],
      pattern: {
        name: 'Cloud earnings momentum',
        similarity: 0.82,
        historicalImpact: '+9.1% in 14 days',
      },
    },
    riskLevel: 'LOW',
  },
];

export const recentAlerts: Alert[] = [
  {
    id: 'alert_001',
    ticker: 'NVDA',
    type: 'breaking',
    message: 'NVDA breaks key resistance at $870',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    severity: 'critical',
  },
  {
    id: 'alert_002',
    ticker: 'AAPL',
    type: 'news',
    message: 'Apple announces Q1 earnings date',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    severity: 'info',
  },
  {
    id: 'alert_003',
    ticker: 'SPY',
    type: 'price',
    message: 'S&P 500 hits new all-time high',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severity: 'info',
  },
  {
    id: 'alert_004',
    ticker: 'TSLA',
    type: 'prediction',
    message: 'SELL prediction confidence increased to 78%',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: 'warning',
  },
  {
    id: 'alert_005',
    ticker: 'META',
    type: 'news',
    message: 'Meta AI assistant launch imminent',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    severity: 'info',
  },
];

export const systemStats: SystemStats = {
  accuracyRate: 0.742,
  predictionsToday: 15,
  modelVersion: 'v2.3.4',
  learningStatus: 'ACTIVE',
  weeklyAccuracy: [0.71, 0.73, 0.75, 0.74, 0.76, 0.73, 0.74],
  factorPerformance: {
    technical: { accuracy: 0.76, weight: 0.30 },
    sentiment: { accuracy: 0.68, weight: 0.20 },
    eventPattern: { accuracy: 0.82, weight: 0.40 },
    fundamental: { accuracy: 0.71, weight: 0.10 },
  },
};

export const historicalEvents: HistoricalEvent[] = [
  {
    id: 'event_001',
    eventType: 'geopolitical',
    eventDate: '2022-02-24',
    title: 'Russia-Ukraine Conflict Begins',
    description: 'Military conflict impacts global markets, energy prices surge, and supply chains disrupted.',
    severityLevel: 9.5,
    affectedSectors: ['Energy', 'Defense', 'Agriculture', 'Semiconductors'],
    affectedCompanies: ['XOM', 'LMT', 'ADM', 'INTC'],
    marketImpact: {
      immediate: { SPY: -2.5, XOM: 4.2, LMT: 5.1 },
      day30: { SPY: -8.2, XOM: 15.3, LMT: 12.8 },
    },
    patternReliability: 0.85,
    recoveryDays: 45,
  },
  {
    id: 'event_002',
    eventType: 'economic',
    eventDate: '2023-03-10',
    title: 'Silicon Valley Bank Collapse',
    description: 'Major bank failure triggers regional banking crisis and market volatility.',
    severityLevel: 8.2,
    affectedSectors: ['Banking', 'Technology', 'Venture Capital'],
    affectedCompanies: ['SIVB', 'FRC', 'JPM', 'BAC'],
    marketImpact: {
      immediate: { SPY: -1.8, XLF: -4.2, QQQ: -2.1 },
      day30: { SPY: 2.5, XLF: -12.5, QQQ: 4.8 },
    },
    patternReliability: 0.78,
    recoveryDays: 30,
  },
  {
    id: 'event_003',
    eventType: 'technological',
    eventDate: '2023-11-30',
    title: 'ChatGPT One Year Anniversary',
    description: 'AI revolution anniversary marks significant tech sector revaluation.',
    severityLevel: 6.5,
    affectedSectors: ['Technology', 'AI', 'Cloud Computing'],
    affectedCompanies: ['NVDA', 'MSFT', 'GOOGL', 'AMD'],
    marketImpact: {
      immediate: { NVDA: 2.8, MSFT: 1.5, GOOGL: 0.8 },
      day30: { NVDA: 18.5, MSFT: 8.2, GOOGL: 5.3 },
    },
    patternReliability: 0.72,
    recoveryDays: 0,
  },
];

export const predictionHistory: Prediction[] = [
  ...topPredictions,
  {
    id: 'pred_h001',
    ticker: 'AMD',
    company: 'Advanced Micro Devices',
    action: 'BUY',
    confidence: 0.82,
    currentPrice: 145.00,
    targetPrice: 165.00,
    stopLoss: 138.00,
    predictedChange: 13.8,
    timeframeDays: 7,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'successful',
    signals: {
      technical: ['RSI oversold (28)', 'Strong support at $142'],
      sentiment: 'Positive (0.65)',
      news: ['AI chip demand surge', 'Server market share gains'],
    },
    riskLevel: 'MEDIUM',
  },
  {
    id: 'pred_h002',
    ticker: 'META',
    company: 'Meta Platforms',
    action: 'BUY',
    confidence: 0.75,
    currentPrice: 485.00,
    targetPrice: 520.00,
    stopLoss: 465.00,
    predictedChange: 7.2,
    timeframeDays: 14,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'successful',
    signals: {
      technical: ['Breakout pattern', 'Volume surge'],
      sentiment: 'Positive (0.58)',
      news: ['Ad revenue growth', 'Cost cutting success'],
    },
    riskLevel: 'MEDIUM',
  },
  {
    id: 'pred_h003',
    ticker: 'GOOGL',
    company: 'Alphabet Inc.',
    action: 'SELL',
    confidence: 0.68,
    currentPrice: 142.00,
    targetPrice: 130.00,
    stopLoss: 148.00,
    predictedChange: -8.5,
    timeframeDays: 10,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'failed',
    signals: {
      technical: ['Head and shoulders pattern', 'Weakening momentum'],
      sentiment: 'Neutral (-0.12)',
      news: ['Antitrust concerns', 'AI competition heating up'],
    },
    riskLevel: 'HIGH',
  },
];

// News source reliability data
export const newsSources = [
  { name: 'Reuters', reliability: 0.92, predictions: 156, successRate: 0.78, status: 'active' as const },
  { name: 'Bloomberg', reliability: 0.89, predictions: 203, successRate: 0.76, status: 'active' as const },
  { name: 'CNBC', reliability: 0.75, predictions: 89, successRate: 0.68, status: 'active' as const },
  { name: 'WSJ', reliability: 0.88, predictions: 134, successRate: 0.74, status: 'active' as const },
  { name: 'MarketWatch', reliability: 0.72, predictions: 67, successRate: 0.65, status: 'review' as const },
  { name: 'SeekingAlpha', reliability: 0.58, predictions: 45, successRate: 0.52, status: 'review' as const },
  { name: 'UnreliableTips', reliability: 0.32, predictions: 23, successRate: 0.38, status: 'blacklisted' as const },
];

// Model updates timeline
export const modelUpdates = [
  { date: '2024-01-15', message: 'Deployed model v2.3.4 with improved sentiment analysis', type: 'upgrade' },
  { date: '2024-01-14', message: 'Increased event_pattern weight from 38% to 40%', type: 'optimization' },
  { date: '2024-01-13', message: 'Blacklisted source "UnreliableTips.net" (38% accuracy)', type: 'blacklist' },
  { date: '2024-01-12', message: 'Added 3 new technical indicators to analysis', type: 'feature' },
  { date: '2024-01-10', message: 'Reduced sentiment weight by 5% after earnings season volatility', type: 'optimization' },
];
