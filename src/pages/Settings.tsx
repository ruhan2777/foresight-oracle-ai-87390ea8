import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Bell, Shield, Eye, Plus, Trash2, MessageSquare, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ModeSwitcher } from '@/components/settings/ModeSwitcher';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    dailyBrief: true,
    breakingAlerts: true,
    priceAlerts: false,
  });

  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [confidenceThreshold, setConfidenceThreshold] = useState([70]);
  const [watchlist, setWatchlist] = useState(['AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL']);
  const [newTicker, setNewTicker] = useState('');

  const addToWatchlist = () => {
    if (newTicker && !watchlist.includes(newTicker.toUpperCase())) {
      setWatchlist([...watchlist, newTicker.toUpperCase()]);
      setNewTicker('');
    }
  };

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist(watchlist.filter(t => t !== ticker));
  };

  const riskLabels = {
    0: 'Conservative',
    50: 'Moderate',
    100: 'Aggressive',
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your preferences and notifications</p>
        </div>

        {/* Mode Switcher */}
        <ModeSwitcher />

        {/* Notification Preferences */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Notification Preferences</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Daily Morning Brief</Label>
                <p className="text-sm text-muted-foreground">Receive a summary of predictions each morning</p>
              </div>
              <Switch
                checked={notifications.dailyBrief}
                onCheckedChange={(checked) => setNotifications({ ...notifications, dailyBrief: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Breaking Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about urgent market events</p>
              </div>
              <Switch
                checked={notifications.breakingAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, breakingAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Price Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify when watchlist stocks hit targets</p>
              </div>
              <Switch
                checked={notifications.priceAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
              />
            </div>

            <div className="pt-4 border-t border-border/50">
              <Label className="text-base mb-4 block">Minimum Confidence Threshold</Label>
              <p className="text-sm text-muted-foreground mb-4">Only show predictions above this confidence level</p>
              <div className="flex items-center gap-4">
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  max={100}
                  min={50}
                  step={5}
                  className="flex-1"
                />
                <span className="font-mono font-bold w-16 text-right">{confidenceThreshold}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Preferences */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-warning" />
            </div>
            <h2 className="text-lg font-semibold">Risk Preferences</h2>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-base mb-4 block">Risk Tolerance</Label>
              <div className="flex items-center gap-4 mb-2">
                <Slider
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                  max={100}
                  min={0}
                  step={50}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Conservative</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className={cn(
                'p-4 rounded-xl border-2 cursor-pointer transition-all',
                riskTolerance[0] === 0 ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'
              )}>
                <h3 className="font-semibold mb-1">Conservative</h3>
                <p className="text-sm text-muted-foreground">Lower risk, smaller position sizes</p>
              </div>
              <div className={cn(
                'p-4 rounded-xl border-2 cursor-pointer transition-all',
                riskTolerance[0] === 50 ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'
              )}>
                <h3 className="font-semibold mb-1">Moderate</h3>
                <p className="text-sm text-muted-foreground">Balanced risk and reward</p>
              </div>
              <div className={cn(
                'p-4 rounded-xl border-2 cursor-pointer transition-all',
                riskTolerance[0] === 100 ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'
              )}>
                <h3 className="font-semibold mb-1">Aggressive</h3>
                <p className="text-sm text-muted-foreground">Higher risk, larger positions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-success" />
            </div>
            <h2 className="text-lg font-semibold">Watchlist</h2>
          </div>

          <div className="flex gap-3 mb-6">
            <Input
              type="text"
              placeholder="Enter ticker symbol..."
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
              className="flex-1 max-w-xs bg-background border-border/50"
            />
            <Button onClick={addToWatchlist} className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {watchlist.map((ticker) => (
              <div
                key={ticker}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 group"
              >
                <span className="font-mono font-bold">{ticker}</span>
                <button
                  onClick={() => removeFromWatchlist(ticker)}
                  className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Integrations */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">API Integrations</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0088cc]/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#0088cc]" />
                </div>
                <div>
                  <h3 className="font-semibold">Telegram</h3>
                  <p className="text-sm text-muted-foreground">Receive alerts via Telegram bot</p>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Download className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Export Data</h3>
                  <p className="text-sm text-muted-foreground">Download your prediction history</p>
                </div>
              </div>
              <Button variant="outline">Export CSV</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
