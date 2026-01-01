import { useState } from 'react';
import { useAppMode } from '@/contexts/AppModeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticker: string;
  company: string;
  currentPrice: number;
}

export function TradeDialog({ open, onOpenChange, ticker, company, currentPrice }: TradeDialogProps) {
  const { virtualPortfolio, updateVirtualPortfolio, addXP, completeMission } = useAppMode();
  const [shares, setShares] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');

  const sharesNum = parseInt(shares) || 0;
  const totalCost = sharesNum * currentPrice;
  const currentHolding = virtualPortfolio.holdings.find(h => h.ticker === ticker);
  const availableShares = currentHolding?.shares || 0;

  const canBuy = sharesNum > 0 && totalCost <= virtualPortfolio.balance;
  const canSell = sharesNum > 0 && sharesNum <= availableShares;

  const handleTrade = () => {
    if (action === 'buy') {
      if (!canBuy) {
        toast.error('Insufficient funds for this trade');
        return;
      }

      const newBalance = virtualPortfolio.balance - totalCost;
      const existingHolding = virtualPortfolio.holdings.find(h => h.ticker === ticker);
      
      let newHoldings;
      if (existingHolding) {
        const totalShares = existingHolding.shares + sharesNum;
        const totalCostBasis = (existingHolding.shares * existingHolding.avgPrice) + totalCost;
        const newAvgPrice = totalCostBasis / totalShares;
        
        newHoldings = virtualPortfolio.holdings.map(h => 
          h.ticker === ticker 
            ? { ...h, shares: totalShares, avgPrice: newAvgPrice }
            : h
        );
      } else {
        newHoldings = [...virtualPortfolio.holdings, { ticker, shares: sharesNum, avgPrice: currentPrice }];
      }

      updateVirtualPortfolio({ balance: newBalance, holdings: newHoldings });
      addXP(25);
      completeMission('first-trade');
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span>Bought {sharesNum} shares of {ticker} for ${totalCost.toLocaleString()}</span>
        </div>
      );
    } else {
      if (!canSell) {
        toast.error('Not enough shares to sell');
        return;
      }

      const saleProceeds = sharesNum * currentPrice;
      const newBalance = virtualPortfolio.balance + saleProceeds;
      const existingHolding = virtualPortfolio.holdings.find(h => h.ticker === ticker)!;
      const remainingShares = existingHolding.shares - sharesNum;

      let newHoldings;
      if (remainingShares === 0) {
        newHoldings = virtualPortfolio.holdings.filter(h => h.ticker !== ticker);
      } else {
        newHoldings = virtualPortfolio.holdings.map(h =>
          h.ticker === ticker ? { ...h, shares: remainingShares } : h
        );
      }

      const pnl = (currentPrice - existingHolding.avgPrice) * sharesNum;
      updateVirtualPortfolio({ balance: newBalance, holdings: newHoldings });
      addXP(pnl > 0 ? 50 : 15);

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span>
            Sold {sharesNum} shares of {ticker} for ${saleProceeds.toLocaleString()}
            {pnl !== 0 && (
              <span className={cn('ml-1', pnl > 0 ? 'text-success' : 'text-destructive')}>
                ({pnl > 0 ? '+' : ''}{pnl.toFixed(2)} P/L)
              </span>
            )}
          </span>
        </div>
      );
    }

    setShares('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Trade {ticker}
          </DialogTitle>
          <DialogDescription>{company}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Price */}
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="text-sm text-muted-foreground">Current Price</div>
            <div className="text-2xl font-mono font-bold">${currentPrice.toFixed(2)}</div>
          </div>

          {/* Buy/Sell Tabs */}
          <Tabs value={action} onValueChange={(v) => setAction(v as 'buy' | 'sell')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="data-[state=active]:bg-success/20 data-[state=active]:text-success">
                <TrendingUp className="w-4 h-4 mr-2" />
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive">
                <TrendingDown className="w-4 h-4 mr-2" />
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Number of Shares</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter shares"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Cash:</span>
                <span className="font-mono">${virtualPortfolio.balance.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Cost:</span>
                <span className={cn('font-mono font-bold', !canBuy && sharesNum > 0 && 'text-destructive')}>
                  ${totalCost.toLocaleString()}
                </span>
              </div>

              {!canBuy && sharesNum > 0 && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>Insufficient funds</span>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={handleTrade}
                disabled={!canBuy}
                variant="default"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Buy {sharesNum > 0 ? `${sharesNum} shares` : ''}
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Number of Shares</Label>
                <Input
                  type="number"
                  min="1"
                  max={availableShares}
                  placeholder="Enter shares"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shares Owned:</span>
                <span className="font-mono">{availableShares}</span>
              </div>

              {currentHolding && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Cost:</span>
                  <span className="font-mono">${currentHolding.avgPrice.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sale Proceeds:</span>
                <span className="font-mono font-bold">${totalCost.toLocaleString()}</span>
              </div>

              {availableShares === 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>You don't own any shares of {ticker}</span>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={handleTrade}
                disabled={!canSell}
                variant="destructive"
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Sell {sharesNum > 0 ? `${sharesNum} shares` : ''}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
