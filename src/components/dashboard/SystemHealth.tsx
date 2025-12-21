import { useState } from 'react';
import { Activity, Brain, Zap, Target, Wifi, WifiOff, AlertTriangle, ChevronDown, ChevronUp, Clock, Server, XCircle } from 'lucide-react';
import { systemStats } from '@/lib/mockData';
import { DataHealthStatus, DataAnomaly } from '@/hooks/useDataOrchestration';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SystemHealthProps {
  dataHealth?: DataHealthStatus | null;
  anomalyHistory?: DataAnomaly[];
  onClearAnomalies?: () => void;
}

export function SystemHealth({ dataHealth, anomalyHistory = [], onClearAnomalies }: SystemHealthProps) {
  const [showAnomalies, setShowAnomalies] = useState(false);
  
  const getStatusColor = (status: DataHealthStatus['status'] | undefined) => {
    switch (status) {
      case 'GREEN': return 'text-success';
      case 'YELLOW': return 'text-warning';
      case 'RED': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };
  
  const getStatusBg = (status: DataHealthStatus['status'] | undefined) => {
    switch (status) {
      case 'GREEN': return 'bg-success';
      case 'YELLOW': return 'bg-warning';
      case 'RED': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };
  
  const getSourceIcon = (source: DataHealthStatus['source'] | undefined) => {
    switch (source) {
      case 'PRIMARY': return <Wifi className="w-4 h-4 text-success" />;
      case 'SECONDARY': return <Wifi className="w-4 h-4 text-warning" />;
      case 'FALLBACK': return <WifiOff className="w-4 h-4 text-destructive" />;
      default: return <Wifi className="w-4 h-4 text-muted-foreground" />;
    }
  };
  
  const getSeverityBadge = (severity: DataAnomaly['severity']) => {
    const colors = {
      LOW: 'bg-warning/20 text-warning border-warning/30',
      MEDIUM: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      HIGH: 'bg-destructive/20 text-destructive border-destructive/30',
    };
    return colors[severity];
  };
  
  return (
    <div className="space-y-2">
      {/* Main Status Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Data Health Status */}
            {dataHealth && (
              <>
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Data Health</span>
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", getStatusBg(dataHealth.status))} />
                    <span className={cn("text-sm font-mono font-bold", getStatusColor(dataHealth.status))}>
                      {dataHealth.status}
                    </span>
                  </div>
                </div>
                
                <div className="h-4 w-px bg-border hidden sm:block" />
                
                <div className="flex items-center gap-2">
                  {getSourceIcon(dataHealth.source)}
                  <span className="text-sm text-muted-foreground">Source</span>
                  <span className="text-sm font-mono">{dataHealth.source}</span>
                </div>
                
                <div className="h-4 w-px bg-border hidden sm:block" />
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Latency</span>
                  <span className={cn(
                    "text-sm font-mono font-bold",
                    dataHealth.latency < 500 ? 'text-success' : 
                    dataHealth.latency < 2000 ? 'text-warning' : 'text-destructive'
                  )}>
                    {dataHealth.latency}ms
                  </span>
                </div>
              </>
            )}
            
            <div className="h-4 w-px bg-border hidden sm:block" />
            
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
              <span className="text-sm text-muted-foreground">Predictions</span>
              <span className="text-sm font-mono font-bold">{systemStats.predictionsToday}</span>
            </div>
            
            <div className="h-4 w-px bg-border hidden sm:block" />
            
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Model</span>
              <span className="text-sm font-mono font-bold">{systemStats.modelVersion}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Anomaly Counter */}
            {anomalyHistory.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnomalies(!showAnomalies)}
                className="flex items-center gap-2 text-warning hover:text-warning"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="font-mono">{anomalyHistory.length}</span>
                <span className="text-xs hidden sm:inline">Anomalies</span>
                {showAnomalies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Learning Status: {systemStats.learningStatus}</span>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Anomaly Log Panel */}
      {showAnomalies && anomalyHistory.length > 0 && (
        <div className="glass-card p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Data Anomaly Log
            </h3>
            {onClearAnomalies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAnomalies}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                <XCircle className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {anomalyHistory.map((anomaly) => (
              <div
                key={anomaly.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30"
              >
                <Badge variant="outline" className={cn("text-xs shrink-0", getSeverityBadge(anomaly.severity))}>
                  {anomaly.severity}
                </Badge>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm">{anomaly.symbol}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(anomaly.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{anomaly.message}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs">
                    <span className="text-muted-foreground">
                      Previous: <span className="font-mono">${anomaly.previousValue.toFixed(2)}</span>
                    </span>
                    <span className="text-muted-foreground">
                      New: <span className="font-mono">${anomaly.newValue.toFixed(2)}</span>
                    </span>
                    <span className={cn(
                      "font-mono font-bold",
                      anomaly.percentChange > 0 ? 'text-success' : 'text-destructive'
                    )}>
                      {anomaly.percentChange > 0 ? '+' : ''}{anomaly.percentChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
