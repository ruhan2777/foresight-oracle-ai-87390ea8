import { useAppMode } from '@/contexts/AppModeContext';
import { Star, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function XPProgressBar() {
  const { virtualPortfolio } = useAppMode();
  const { xp, level } = virtualPortfolio;
  
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const progressInLevel = xp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (progressInLevel / xpNeededForLevel) * 100;

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <Star className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-bold text-emerald-400">Lv.{level}</span>
      </div>
      
      <div className="flex items-center gap-2 min-w-[120px]">
        <Progress 
          value={progressPercent} 
          className="h-2 bg-emerald-950/50 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-400"
        />
      </div>
      
      <div className="flex items-center gap-1 text-xs text-emerald-400/70">
        <Zap className="w-3 h-3" />
        <span className="font-mono">{xp} XP</span>
      </div>
    </div>
  );
}
