import { useAppMode } from '@/contexts/AppModeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Briefcase, DollarSign, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { topPredictions } from '@/lib/mockData';

export function PortfolioPanel() {
  const { virtualPortfolio } = useAppMode();
  const { balance, holdings } = virtualPortfolio;

  // Get current prices from mock data (in real app, would fetch live prices)
  const getCurrentPrice = (ticker: string) => {
    const prediction = topPredictions.find(p => p.ticker === ticker);
    return prediction?.currentPrice || 0;
  };

  // Calculate portfolio metrics
  const holdingsWithMetrics = holdings.map(holding => {
    const currentPrice = getCurrentPrice(holding.ticker);
    const marketValue = holding.shares * currentPrice;
    const costBasis = holding.shares * holding.avgPrice;
    const pnl = marketValue - costBasis;
    const pnlPercent = costBasis > 0 ? ((pnl / costBasis) * 100) : 0;
    
    return {
      ...holding,
      currentPrice,
      marketValue,
      costBasis,
      pnl,
      pnlPercent,
    };
  });

  const totalMarketValue = holdingsWithMetrics.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCostBasis = holdingsWithMetrics.reduce((sum, h) => sum + h.costBasis, 0);
  const totalPnL = totalMarketValue - totalCostBasis;
  const totalPnLPercent = totalCostBasis > 0 ? ((totalPnL / totalCostBasis) * 100) : 0;
  const portfolioValue = balance + totalMarketValue;
  const overallPnL = portfolioValue - 100000;
  const overallPnLPercent = (overallPnL / 100000) * 100;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Your Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <PieChart className="w-3.5 h-3.5" />
              Total Value
            </div>
            <div className="font-mono font-bold text-lg">
              ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              Cash
            </div>
            <div className="font-mono font-bold text-lg">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Holdings Value</div>
            <div className="font-mono font-bold text-lg">
              ${totalMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className={cn(
            'p-3 rounded-lg',
            overallPnL >= 0 ? 'bg-success/10' : 'bg-destructive/10'
          )}>
            <div className="text-xs text-muted-foreground mb-1">Total P/L</div>
            <div className={cn(
              'font-mono font-bold text-lg flex items-center gap-1',
              overallPnL >= 0 ? 'text-success' : 'text-destructive'
            )}>
              {overallPnL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {overallPnL >= 0 ? '+' : ''}${overallPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              <span className="text-xs">({overallPnLPercent >= 0 ? '+' : ''}{overallPnLPercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        {holdings.length > 0 ? (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Avg Cost</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Market Value</TableHead>
                  <TableHead className="text-right">P/L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsWithMetrics.map((holding) => (
                  <TableRow key={holding.ticker}>
                    <TableCell className="font-bold">{holding.ticker}</TableCell>
                    <TableCell className="text-right font-mono">{holding.shares}</TableCell>
                    <TableCell className="text-right font-mono">${holding.avgPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono">${holding.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono">${holding.marketValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'font-mono',
                          holding.pnl >= 0 
                            ? 'border-success/30 bg-success/10 text-success' 
                            : 'border-destructive/30 bg-destructive/10 text-destructive'
                        )}
                      >
                        {holding.pnl >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No holdings yet</p>
            <p className="text-xs mt-1">Click "Trade" on any stock to start building your portfolio</p>
          </div>
        )}

        {/* Position P/L Summary */}
        {holdings.length > 0 && (
          <div className="flex justify-between items-center pt-2 border-t border-border/50">
            <span className="text-sm text-muted-foreground">Holdings P/L</span>
            <span className={cn(
              'font-mono font-bold',
              totalPnL >= 0 ? 'text-success' : 'text-destructive'
            )}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} ({totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
