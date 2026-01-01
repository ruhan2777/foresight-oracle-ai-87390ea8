import { TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { Prediction } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAppMode } from '@/contexts/AppModeContext';
import { TradeButton } from '@/components/academy/TradeButton';

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const { mode } = useAppMode();
  const isAcademy = mode === 'academy';
  
  const {
    ticker,
    company,
    action,
    confidence,
    currentPrice,
    targetPrice,
    predictedChange,
    timeframeDays,
    signals,
    riskLevel,
  } = prediction;

  const actionConfig = {
    BUY: {
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      icon: TrendingUp,
      glow: 'hover:shadow-[0_0_30px_hsl(var(--success)/0.3)]',
    },
    SELL: {
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
      icon: TrendingDown,
      glow: 'hover:shadow-[0_0_30px_hsl(var(--destructive)/0.3)]',
    },
    HOLD: {
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      icon: Minus,
      glow: 'hover:shadow-[0_0_30px_hsl(var(--warning)/0.3)]',
    },
  };

  const config = actionConfig[action];
  const ActionIcon = config.icon;

  const riskColors = {
    LOW: 'text-success',
    MEDIUM: 'text-warning',
    HIGH: 'text-destructive',
  };

  return (
    <div
      className={cn(
        'glass-card p-5 transition-all duration-300 hover:-translate-y-1',
        config.glow
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold">{ticker}</span>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1',
                config.bg,
                config.color
              )}
            >
              <ActionIcon className="w-3 h-3" />
              {action}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Confidence</div>
          <div className={cn('text-xl font-mono font-bold', config.color)}>
            {(confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className={cn('h-full rounded-full transition-all duration-500', config.bg.replace('/10', ''))}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>

      {/* Price info */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-muted/30">
          <div className="text-xs text-muted-foreground mb-1">Current</div>
          <div className="font-mono font-bold">${currentPrice.toFixed(2)}</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted/30">
          <div className="text-xs text-muted-foreground mb-1">Target</div>
          <div className="font-mono font-bold">${targetPrice.toFixed(2)}</div>
        </div>
        <div className={cn('text-center p-2 rounded-lg', config.bg)}>
          <div className="text-xs text-muted-foreground mb-1">Return</div>
          <div className={cn('font-mono font-bold', config.color)}>
            {predictedChange >= 0 ? '+' : ''}{predictedChange.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Signals */}
      <div className="space-y-2 mb-4">
        {signals.technical.slice(0, 2).map((signal, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <span className="text-muted-foreground">{signal}</span>
          </div>
        ))}
        {signals.pattern && (
          <div className="flex items-start gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              {signals.pattern.name} ({(signals.pattern.similarity * 100).toFixed(0)}% match)
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{timeframeDays} days</span>
          </div>
          <div className={cn('flex items-center gap-1.5', riskColors[riskLevel])}>
            <AlertTriangle className="w-4 h-4" />
            <span>{riskLevel}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAcademy && (
            <TradeButton ticker={ticker} company={company} currentPrice={currentPrice} />
          )}
          <Link
            to={`/analysis?ticker=${ticker}`}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View Analysis
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
