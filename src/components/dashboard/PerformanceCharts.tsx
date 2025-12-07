import { systemStats } from '@/lib/mockData';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export function PerformanceCharts() {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const accuracyData = systemStats.weeklyAccuracy.map((value, index) => ({
    day: weekDays[index],
    accuracy: value * 100,
  }));

  const winRate = 0.68; // 68% success rate
  const pieData = [
    { name: 'Successful', value: winRate * 100, color: 'hsl(var(--success))' },
    { name: 'Failed', value: (1 - winRate) * 100, color: 'hsl(var(--destructive))' },
  ];

  const topPerformers = [
    { ticker: 'NVDA', return: '+15.2%' },
    { ticker: 'AMD', return: '+12.8%' },
    { ticker: 'META', return: '+9.5%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Weekly Accuracy Chart */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Weekly Accuracy</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accuracyData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                domain={[60, 80]}
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
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Win Rate Donut */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Win Rate</h3>
        <div className="h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-mono font-bold">{(winRate * 100).toFixed(0)}%</span>
            <span className="text-xs text-muted-foreground">Success</span>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Won</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">Lost</span>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Top Performers This Week</h3>
        <div className="space-y-3">
          {topPerformers.map((performer, index) => (
            <div
              key={performer.ticker}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="font-mono font-bold">{performer.ticker}</span>
              </div>
              <span className="font-mono font-bold text-success">{performer.return}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
