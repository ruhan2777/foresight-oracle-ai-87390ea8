import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppMode = 'academy' | 'terminal' | null;

interface VirtualPortfolio {
  balance: number;
  holdings: { ticker: string; shares: number; avgPrice: number }[];
  xp: number;
  level: number;
  completedMissions: string[];
}

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  virtualPortfolio: VirtualPortfolio;
  updateVirtualPortfolio: (updates: Partial<VirtualPortfolio>) => void;
  addXP: (amount: number) => void;
  completeMission: (missionId: string) => void;
  showWelcomeTooltip: boolean;
  dismissWelcomeTooltip: () => void;
}

const defaultVirtualPortfolio: VirtualPortfolio = {
  balance: 100000,
  holdings: [],
  xp: 0,
  level: 1,
  completedMissions: [],
};

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(() => {
    const stored = localStorage.getItem('appMode');
    return stored ? (stored as AppMode) : null;
  });

  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(() => {
    return localStorage.getItem('hasCompletedOnboarding') === 'true';
  });

  const [virtualPortfolio, setVirtualPortfolio] = useState<VirtualPortfolio>(() => {
    const stored = localStorage.getItem('virtualPortfolio');
    return stored ? JSON.parse(stored) : defaultVirtualPortfolio;
  });

  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(() => {
    return localStorage.getItem('welcomeTooltipDismissed') !== 'true';
  });

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    if (newMode) {
      localStorage.setItem('appMode', newMode);
    } else {
      localStorage.removeItem('appMode');
    }
  };

  const setHasCompletedOnboarding = (completed: boolean) => {
    setHasCompletedOnboardingState(completed);
    localStorage.setItem('hasCompletedOnboarding', String(completed));
  };

  const updateVirtualPortfolio = (updates: Partial<VirtualPortfolio>) => {
    setVirtualPortfolio(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('virtualPortfolio', JSON.stringify(updated));
      return updated;
    });
  };

  const addXP = (amount: number) => {
    setVirtualPortfolio(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      const updated = { ...prev, xp: newXP, level: newLevel };
      localStorage.setItem('virtualPortfolio', JSON.stringify(updated));
      return updated;
    });
  };

  const completeMission = (missionId: string) => {
    setVirtualPortfolio(prev => {
      if (prev.completedMissions.includes(missionId)) return prev;
      const updated = {
        ...prev,
        completedMissions: [...prev.completedMissions, missionId],
      };
      localStorage.setItem('virtualPortfolio', JSON.stringify(updated));
      return updated;
    });
  };

  const dismissWelcomeTooltip = () => {
    setShowWelcomeTooltip(false);
    localStorage.setItem('welcomeTooltipDismissed', 'true');
  };

  return (
    <AppModeContext.Provider
      value={{
        mode,
        setMode,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        virtualPortfolio,
        updateVirtualPortfolio,
        addXP,
        completeMission,
        showWelcomeTooltip,
        dismissWelcomeTooltip,
      }}
    >
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
}
