import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { TradeDialog } from './TradeDialog';

interface TradeButtonProps {
  ticker: string;
  company: string;
  currentPrice: number;
}

export function TradeButton({ ticker, company, currentPrice }: TradeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
      >
        <ArrowRightLeft className="w-3.5 h-3.5" />
        Trade
      </Button>
      
      <TradeDialog
        open={open}
        onOpenChange={setOpen}
        ticker={ticker}
        company={company}
        currentPrice={currentPrice}
      />
    </>
  );
}
