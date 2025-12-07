import { Zap, TrendingUp, Newspaper, Target } from 'lucide-react';
import { recentAlerts, Alert } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const alertIcons = {
  breaking: Zap,
  price: TrendingUp,
  news: Newspaper,
  prediction: Target,
};

const severityColors = {
  info: 'text-primary',
  warning: 'text-warning',
  critical: 'text-destructive',
};

export function AlertsSidebar() {
  return (
    <div className="glass-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Alerts
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
        {recentAlerts.map((alert) => {
          const Icon = alertIcons[alert.type];
          const colorClass = severityColors[alert.severity];
          
          return (
            <div
              key={alert.id}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-lg bg-muted', colorClass)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm">{alert.ticker}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug group-hover:text-foreground transition-colors">
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
