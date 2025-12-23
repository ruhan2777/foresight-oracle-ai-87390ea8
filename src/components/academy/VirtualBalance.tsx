import { useAppMode } from '@/contexts/AppModeContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export function VirtualBalance() {
  const { virtualPortfolio } = useAppMode();
  const { balance, holdings } = virtualPortfolio;

  // Calculate total portfolio value (simplified - would need real prices)
  const holdingsValue = holdings.reduce((acc, h) => acc + (h.shares * h.avgPrice), 0);
  const totalValue = balance + holdingsValue;
  const pnl = totalValue - 100000;
  const pnlPercent = ((pnl / 100000) * 100).toFixed(2);
  const isPositive = pnl >= 0;

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-primary" />
        <span className="text-sm font-mono font-bold text-foreground">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>
      
      <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        <span className="font-mono">{isPositive ? '+' : ''}{pnlPercent}%</span>
      </div>
    </div>
  );
}
