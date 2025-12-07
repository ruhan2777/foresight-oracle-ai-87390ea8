import { Layout } from '@/components/layout/Layout';
import { systemStats, newsSources, modelUpdates } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Brain, TrendingUp, AlertTriangle, Check, X, Clock, Zap, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Insights = () => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const accuracyTrend = systemStats.weeklyAccuracy.map((value, index) => ({
    day: weekDays[index],
    accuracy: value * 100,
  }));

  const factorData = Object.entries(systemStats.factorPerformance).map(([name, data]) => ({
    name: name.replace(/([A-Z])/g, ' $1').trim(),
    accuracy: data.accuracy * 100,
    weight: data.weight * 100,
  }));

  const statusColors = {
    active: 'text-success',
    review: 'text-warning',
    blacklisted: 'text-destructive',
  };

  const statusBg = {
    active: 'bg-success/10',
    review: 'bg-warning/10',
    blacklisted: 'bg-destructive/10',
  };

  const updateIcons = {
    upgrade: Zap,
    optimization: Settings,
    blacklist: X,
    feature: Check,
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Learning Insights</h1>
          <p className="text-muted-foreground mt-1">AI system intelligence and model performance</p>
        </div>

        {/* Model Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Model Version</div>
            </div>
            <div className="text-2xl font-mono font-bold">{systemStats.modelVersion}</div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-sm text-muted-foreground">Overall Accuracy</div>
            </div>
            <div className="text-2xl font-mono font-bold text-success">
              {(systemStats.accuracyRate * 100).toFixed(1)}%
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Predictions Today</div>
            </div>
            <div className="text-2xl font-mono font-bold">{systemStats.predictionsToday}</div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-success" />
              </div>
              <div className="text-sm text-muted-foreground">Learning Status</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-success">{systemStats.learningStatus}</div>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accuracy Trend */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Weekly Accuracy Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyTrend}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    domain={[65, 80]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Accuracy']}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Factor Performance */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Factor Performance</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={factorData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [`${value.toFixed(0)}%`, name === 'accuracy' ? 'Accuracy' : 'Weight']}
                  />
                  <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {factorData.map((factor) => (
                <div key={factor.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm capitalize">{factor.name}</span>
                  <span className="text-xs text-muted-foreground">Weight: {factor.weight.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Source Reliability */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">News Source Reliability</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Source</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reliability</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Predictions</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Success Rate</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {newsSources.map((source) => (
                  <tr key={source.name} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="py-3 px-4 font-medium">{source.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              source.reliability >= 0.8 ? 'bg-success' : source.reliability >= 0.6 ? 'bg-warning' : 'bg-destructive'
                            )}
                            style={{ width: `${source.reliability * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-sm">{(source.reliability * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{source.predictions}</td>
                    <td className="py-3 px-4 text-center font-mono">{(source.successRate * 100).toFixed(0)}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn('px-3 py-1 rounded-full text-xs font-medium capitalize', statusBg[source.status], statusColors[source.status])}>
                        {source.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Model Updates */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Model Updates</h2>
          <div className="space-y-4">
            {modelUpdates.map((update, index) => {
              const Icon = updateIcons[update.type as keyof typeof updateIcons] || Settings;
              const iconColor = update.type === 'upgrade' ? 'text-success' : update.type === 'blacklist' ? 'text-destructive' : 'text-primary';

              return (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                  <div className={cn('w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0', iconColor)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{update.message}</p>
                    <span className="text-xs text-muted-foreground">{update.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Insights;
