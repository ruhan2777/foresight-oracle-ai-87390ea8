import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { predictionHistory, Prediction } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Search, Filter, TrendingUp, TrendingDown, Minus, Check, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const History = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'successful' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPredictions = predictionHistory.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: predictionHistory.length,
    successful: predictionHistory.filter(p => p.status === 'successful').length,
    failed: predictionHistory.filter(p => p.status === 'failed').length,
    pending: predictionHistory.filter(p => p.status === 'pending').length,
  };

  const winRate = stats.total > 0 ? (stats.successful / (stats.successful + stats.failed)) * 100 : 0;

  const actionConfig = {
    BUY: { color: 'text-success', bg: 'bg-success/10', icon: TrendingUp },
    SELL: { color: 'text-destructive', bg: 'bg-destructive/10', icon: TrendingDown },
    HOLD: { color: 'text-warning', bg: 'bg-warning/10', icon: Minus },
  };

  const statusConfig = {
    pending: { color: 'text-primary', bg: 'bg-primary/10', icon: null },
    successful: { color: 'text-success', bg: 'bg-success/10', icon: Check },
    failed: { color: 'text-destructive', bg: 'bg-destructive/10', icon: X },
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Prediction History</h1>
          <p className="text-muted-foreground mt-1">Track and analyze past predictions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Predictions</div>
            <div className="text-3xl font-mono font-bold">{stats.total}</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
            <div className="text-3xl font-mono font-bold text-success">{winRate.toFixed(1)}%</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-sm text-muted-foreground mb-1">Successful</div>
            <div className="text-3xl font-mono font-bold text-success">{stats.successful}</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-sm text-muted-foreground mb-1">Failed</div>
            <div className="text-3xl font-mono font-bold text-destructive">{stats.failed}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by ticker or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border/50"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'pending', 'successful', 'failed'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={cn(
                    filter === status && 'bg-primary text-primary-foreground'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Predictions List */}
        <div className="space-y-3">
          {filteredPredictions.map((prediction) => {
            const actionCfg = actionConfig[prediction.action];
            const statusCfg = statusConfig[prediction.status];
            const ActionIcon = actionCfg.icon;
            const StatusIcon = statusCfg.icon;

            const actualReturn = prediction.status === 'successful'
              ? prediction.predictedChange * 0.8 + Math.random() * prediction.predictedChange * 0.4
              : prediction.status === 'failed'
                ? -Math.abs(prediction.predictedChange * 0.5)
                : null;

            return (
              <div key={prediction.id} className="glass-card-hover p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', statusCfg.bg)}>
                      {StatusIcon ? (
                        <StatusIcon className={cn('w-5 h-5', statusCfg.color)} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>

                    {/* Ticker & Company */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{prediction.ticker}</span>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1', actionCfg.bg, actionCfg.color)}>
                          <ActionIcon className="w-3 h-3" />
                          {prediction.action}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{prediction.company}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-sm text-muted-foreground md:text-center">
                    <div>Created</div>
                    <div className="font-mono">{format(new Date(prediction.createdAt), 'MMM d, yyyy')}</div>
                  </div>

                  {/* Confidence */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Confidence</div>
                    <div className="font-mono font-bold">{(prediction.confidence * 100).toFixed(0)}%</div>
                  </div>

                  {/* Predicted */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Predicted</div>
                    <div className={cn('font-mono font-bold', prediction.predictedChange >= 0 ? 'text-success' : 'text-destructive')}>
                      {prediction.predictedChange >= 0 ? '+' : ''}{prediction.predictedChange.toFixed(1)}%
                    </div>
                  </div>

                  {/* Actual */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Actual</div>
                    {actualReturn !== null ? (
                      <div className={cn('font-mono font-bold', actualReturn >= 0 ? 'text-success' : 'text-destructive')}>
                        {actualReturn >= 0 ? '+' : ''}{actualReturn.toFixed(1)}%
                      </div>
                    ) : (
                      <div className="font-mono text-muted-foreground">—</div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className={cn('px-3 py-1 rounded-full text-sm font-medium', statusCfg.bg, statusCfg.color)}>
                    {prediction.status.charAt(0).toUpperCase() + prediction.status.slice(1)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPredictions.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">No predictions found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;
