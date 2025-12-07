import { Activity, Brain, Zap, Target } from 'lucide-react';
import { systemStats } from '@/lib/mockData';

export function SystemHealth() {
  return (
    <div className="glass-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI Accuracy</span>
            <span className="text-sm font-mono font-bold text-primary">
              {(systemStats.accuracyRate * 100).toFixed(1)}%
            </span>
          </div>
          
          <div className="h-4 w-px bg-border hidden sm:block" />
          
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Predictions Today</span>
            <span className="text-sm font-mono font-bold">{systemStats.predictionsToday}</span>
          </div>
          
          <div className="h-4 w-px bg-border hidden sm:block" />
          
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Model</span>
            <span className="text-sm font-mono font-bold">{systemStats.modelVersion}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success">Learning Status: {systemStats.learningStatus}</span>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        </div>
      </div>
    </div>
  );
}
