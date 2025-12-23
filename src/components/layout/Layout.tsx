import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { useAppMode } from '@/contexts/AppModeContext';
import { MissionsSidebar } from '@/components/academy/MissionsSidebar';
import { WelcomeTooltip } from '@/components/onboarding/WelcomeTooltip';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { mode } = useAppMode();
  const isAcademy = mode === 'academy';

  return (
    <div className="min-h-screen bg-background">
      {/* Background grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      
      {/* Gradient orbs for visual depth */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />
      
      <Navbar />
      
      <main className="relative pt-20 pb-8 px-4 sm:px-6 max-w-[1600px] mx-auto">
        {children}
      </main>

      {/* Academy Mode: Missions Sidebar */}
      {isAcademy && <MissionsSidebar />}

      {/* Welcome Tooltip */}
      <WelcomeTooltip />
    </div>
  );
}
