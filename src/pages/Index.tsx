import { Layout } from '@/components/layout/Layout';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { SentimentGauge } from '@/components/dashboard/SentimentGauge';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { AlertsSidebar } from '@/components/dashboard/AlertsSidebar';
import { PerformanceCharts } from '@/components/dashboard/PerformanceCharts';
import { PortfolioPanel } from '@/components/academy/PortfolioPanel';
import { topPredictions } from '@/lib/mockData';
import { useDataOrchestration } from '@/hooks/useDataOrchestration';
import { useAppMode } from '@/contexts/AppModeContext';

const Index = () => {
  const { mode } = useAppMode();
  const isAcademy = mode === 'academy';
  
  const { 
    health, 
    anomalyHistory, 
    sentimentData,
    clearAnomalies,
  } = useDataOrchestration({
    symbols: ['SPY', 'QQQ', 'DIA'],
    refreshInterval: 60000,
    enableSentiment: true,
  });

  // Calculate average weighted sentiment from all symbols
  const avgSentiment = sentimentData.length > 0
    ? sentimentData.reduce((sum, s) => sum + s.weightedSentiment, 0) / sentimentData.length
    : 0.42; // Fallback to default

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered stock predictions and market analysis
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Last updated:</span>
            <span className="font-mono">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* System Health Bar with Data Health Status */}
        <SystemHealth 
          dataHealth={health} 
          anomalyHistory={anomalyHistory}
          onClearAnomalies={clearAnomalies}
        />

        {/* Market Overview */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Market Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <MarketOverview />
            </div>
            <div>
              <SentimentGauge value={avgSentiment} />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Predictions Grid */}
          <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today's Top Predictions</h2>
              <span className="text-sm text-muted-foreground">
                {topPredictions.length} active predictions
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topPredictions.map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          </div>

          {/* Alerts Sidebar */}
          <div className="xl:col-span-1">
            <AlertsSidebar />
          </div>
        </div>

        {/* Portfolio Panel - Academy Mode Only */}
        {isAcademy && (
          <section>
            <PortfolioPanel />
          </section>
        )}

        {/* Performance Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Performance Analytics</h2>
          <PerformanceCharts />
        </section>
      </div>
    </Layout>
  );
};

export default Index;
