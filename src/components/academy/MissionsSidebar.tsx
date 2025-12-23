import { useState } from 'react';
import { useAppMode } from '@/contexts/AppModeContext';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Zap,
  TrendingUp,
  Eye,
  BookOpen,
  Trophy,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: typeof Target;
  category: 'learn' | 'trade' | 'analyze';
}

const missions: Mission[] = [
  {
    id: 'check-sentiment',
    title: 'Check the Sentiment',
    description: 'View the market sentiment gauge on the dashboard',
    xpReward: 50,
    icon: Eye,
    category: 'learn',
  },
  {
    id: 'first-prediction',
    title: 'Study a Prediction',
    description: 'Review an AI prediction card and its confidence level',
    xpReward: 75,
    icon: TrendingUp,
    category: 'analyze',
  },
  {
    id: 'read-reasoning',
    title: 'AI Reasoning Deep Dive',
    description: 'Read through a complete AI reasoning log entry',
    xpReward: 100,
    icon: BookOpen,
    category: 'learn',
  },
  {
    id: 'paper-trade',
    title: 'Execute a Paper Trade',
    description: 'Make your first virtual trade using the paper trading system',
    xpReward: 150,
    icon: Target,
    category: 'trade',
  },
  {
    id: 'watchlist-add',
    title: 'Build Your Watchlist',
    description: 'Add 3 stocks to your personal watchlist',
    xpReward: 50,
    icon: Trophy,
    category: 'learn',
  },
];

export function MissionsSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { virtualPortfolio, completeMission, addXP } = useAppMode();
  const { completedMissions } = virtualPortfolio;

  const handleCompleteMission = (mission: Mission) => {
    if (completedMissions.includes(mission.id)) return;
    
    completeMission(mission.id);
    addXP(mission.xpReward);
    toast.success(`Mission Complete! +${mission.xpReward} XP`, {
      description: mission.title,
    });
  };

  const completedCount = completedMissions.length;
  const totalMissions = missions.length;

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-24 z-40 w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-lg"
        size="icon"
      >
        <Target className="w-5 h-5 text-emerald-400" />
      </Button>
    );
  }

  return (
    <div className="fixed right-4 top-24 z-40 w-80 glass-card border-emerald-500/20 shadow-xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-400">Missions</h3>
            <p className="text-xs text-muted-foreground">{completedCount}/{totalMissions} completed</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="h-2 rounded-full bg-emerald-950/50 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${(completedCount / totalMissions) * 100}%` }}
          />
        </div>
      </div>

      {/* Missions List */}
      <div className="p-2 max-h-[400px] overflow-y-auto scrollbar-thin">
        {missions.map((mission) => {
          const isCompleted = completedMissions.includes(mission.id);
          const Icon = mission.icon;
          
          return (
            <button
              key={mission.id}
              onClick={() => handleCompleteMission(mission)}
              disabled={isCompleted}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all',
                isCompleted
                  ? 'opacity-60 cursor-default'
                  : 'hover:bg-emerald-500/5 cursor-pointer'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                isCompleted ? 'bg-emerald-500/20' : 'bg-muted/50'
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-sm font-medium',
                    isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
                  )}>
                    {mission.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {mission.description}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400">+{mission.xpReward} XP</span>
                </div>
              </div>

              {!isCompleted && (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
