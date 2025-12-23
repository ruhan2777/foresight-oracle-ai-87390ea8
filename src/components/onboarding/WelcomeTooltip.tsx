import { useAppMode } from '@/contexts/AppModeContext';
import { X, Sparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function WelcomeTooltip() {
  const { mode, showWelcomeTooltip, dismissWelcomeTooltip } = useAppMode();

  if (!showWelcomeTooltip || !mode) return null;

  const isAcademy = mode === 'academy';

  return (
    <div className={cn(
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4',
      'animate-slide-up'
    )}>
      <div className={cn(
        'relative p-4 rounded-xl border shadow-xl backdrop-blur-xl',
        isAcademy 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-slate-800/80 border-slate-600/30'
      )}>
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={dismissWelcomeTooltip}
          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex items-start gap-3 pr-6">
          {/* Icon */}
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            isAcademy 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
              : 'bg-gradient-to-br from-slate-600 to-slate-700'
          )}>
            {isAcademy ? (
              <Sparkles className="w-5 h-5 text-white" />
            ) : (
              <Terminal className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Content */}
          <div>
            <h4 className={cn(
              'font-semibold mb-1',
              isAcademy ? 'text-emerald-400' : 'text-slate-300'
            )}>
              {isAcademy ? 'Welcome, Analyst!' : 'Terminal Active'}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAcademy 
                ? "Your $100K virtual capital is ready. Complete your first mission: Check the Sentiment to earn 50 XP."
                : "AI Models Online. Real-time data stream prioritised. Your reasoning logs are now visible for all major indices."
              }
            </p>
          </div>
        </div>

        {/* Dismiss text */}
        <button
          onClick={dismissWelcomeTooltip}
          className={cn(
            'mt-3 text-xs transition-colors',
            isAcademy 
              ? 'text-emerald-400/70 hover:text-emerald-400' 
              : 'text-slate-500 hover:text-slate-400'
          )}
        >
          Click to dismiss
        </button>
      </div>
    </div>
  );
}
