import { useAppMode, AppMode } from '@/contexts/AppModeContext';
import { GraduationCap, LineChart, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ModeSwitcher() {
  const { mode, setMode } = useAppMode();

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    toast.success(`Switched to ${newMode === 'academy' ? 'Academy' : 'Terminal'} Mode`);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">App Mode</h2>
          <p className="text-sm text-muted-foreground">Switch between Academy and Terminal modes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Academy Mode */}
        <button
          onClick={() => handleModeChange('academy')}
          className={cn(
            'relative p-5 rounded-xl border-2 text-left transition-all duration-300',
            mode === 'academy'
              ? 'border-emerald-500/50 bg-emerald-500/10'
              : 'border-border/50 hover:border-emerald-500/30 hover:bg-emerald-500/5'
          )}
        >
          {mode === 'academy' && (
            <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          )}
          
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          
          <h3 className={cn(
            'font-semibold mb-1',
            mode === 'academy' ? 'text-emerald-400' : 'text-foreground'
          )}>
            Academy Mode
          </h3>
          <p className="text-sm text-muted-foreground">
            Gamified learning with XP, missions, and $100K virtual trading
          </p>
        </button>

        {/* Terminal Mode */}
        <button
          onClick={() => handleModeChange('terminal')}
          className={cn(
            'relative p-5 rounded-xl border-2 text-left transition-all duration-300',
            mode === 'terminal'
              ? 'border-slate-500/50 bg-slate-700/20'
              : 'border-border/50 hover:border-slate-500/30 hover:bg-slate-700/10'
          )}
        >
          {mode === 'terminal' && (
            <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-slate-400 animate-pulse" />
          )}
          
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mb-4 border border-slate-500/30">
            <LineChart className="w-6 h-6 text-slate-200" />
          </div>
          
          <h3 className={cn(
            'font-semibold mb-1',
            mode === 'terminal' ? 'text-slate-300' : 'text-foreground'
          )}>
            Terminal Mode
          </h3>
          <p className="text-sm text-muted-foreground">
            Professional interface with AI reasoning logs and data analytics
          </p>
        </button>
      </div>

      {mode === 'academy' && (
        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Virtual portfolio data will be preserved when switching modes
        </p>
      )}
    </div>
  );
}
