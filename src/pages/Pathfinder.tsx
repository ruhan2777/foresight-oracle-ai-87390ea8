import { useNavigate } from 'react-router-dom';
import { GraduationCap, LineChart, Sparkles, Shield, Zap, Target } from 'lucide-react';
import { useAppMode } from '@/contexts/AppModeContext';
import { cn } from '@/lib/utils';

export default function Pathfinder() {
  const navigate = useNavigate();
  const { setMode, setHasCompletedOnboarding } = useAppMode();

  const selectMode = (mode: 'academy' | 'terminal') => {
    setMode(mode);
    setHasCompletedOnboarding(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-success/8 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome to Exchange</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Choose Your <span className="gradient-text">Path</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Select how you want to experience the market. You can always switch modes later.
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-5xl">
          {/* Academy Card */}
          <button
            onClick={() => selectMode('academy')}
            className={cn(
              'group relative p-8 rounded-2xl text-left transition-all duration-500',
              'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10',
              'border-2 border-emerald-500/20 hover:border-emerald-400/50',
              'hover:shadow-[0_0_60px_rgba(16,185,129,0.2)]',
              'animate-slide-up'
            )}
            style={{ animationDelay: '0.1s' }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-success-foreground" />
              </div>
            </div>

            {/* Content */}
            <div className="relative">
              <h2 className="text-2xl font-bold mb-2 text-emerald-400 group-hover:text-emerald-300 transition-colors">
                Start Your Journey
              </h2>
              <p className="text-sm font-medium text-emerald-500/70 mb-4 uppercase tracking-wider">
                Academy Mode
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Master the markets without the risk. Access a virtual $100K, complete missions, and earn rewards as you learn to trade like a pro.
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-muted-foreground">Gamified learning missions</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-muted-foreground">XP rewards & level progression</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-muted-foreground">Risk-free paper trading</span>
                </div>
              </div>
            </div>

            {/* CTA indicator */}
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-xl">→</span>
              </div>
            </div>
          </button>

          {/* Terminal Card */}
          <button
            onClick={() => selectMode('terminal')}
            className={cn(
              'group relative p-8 rounded-2xl text-left transition-all duration-500',
              'bg-gradient-to-br from-slate-700/30 via-slate-800/20 to-slate-900/30',
              'border-2 border-slate-600/30 hover:border-slate-500/50',
              'hover:shadow-[0_0_60px_rgba(100,116,139,0.15)]',
              'animate-slide-up'
            )}
            style={{ animationDelay: '0.2s' }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-600/30 border border-slate-500/30">
                <LineChart className="w-8 h-8 text-slate-200" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-500 flex items-center justify-center border border-slate-400/30">
                <span className="text-[10px] font-bold text-slate-200">PRO</span>
              </div>
            </div>

            {/* Content */}
            <div className="relative">
              <h2 className="text-2xl font-bold mb-2 text-slate-300 group-hover:text-slate-200 transition-colors">
                Access the Terminal
              </h2>
              <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">
                Professional Mode
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Zero noise. Pure Alpha. Institutional-grade AI monitoring, sentiment reliability scoring, and real-time reasoning logs for the serious trader.
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center border border-slate-600/30">
                    <LineChart className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-muted-foreground">High-density data displays</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center border border-slate-600/30">
                    <Zap className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-muted-foreground">AI reasoning logs & analytics</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center border border-slate-600/30">
                    <Shield className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-muted-foreground">Sentiment reliability scoring</span>
                </div>
              </div>
            </div>

            {/* CTA indicator */}
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
              <div className="w-10 h-10 rounded-full bg-slate-600/30 flex items-center justify-center border border-slate-500/30">
                <span className="text-slate-400 text-xl">→</span>
              </div>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <p className="text-sm text-muted-foreground mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          You can switch between modes anytime in Settings
        </p>
      </div>
    </div>
  );
}
