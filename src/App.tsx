import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppModeProvider, useAppMode } from "@/contexts/AppModeContext";
import Index from "./pages/Index";
import Analysis from "./pages/Analysis";
import History from "./pages/History";
import Events from "./pages/Events";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import Pathfinder from "./pages/Pathfinder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { mode, hasCompletedOnboarding } = useAppMode();

  // If user hasn't completed onboarding, show pathfinder
  if (!hasCompletedOnboarding || !mode) {
    return (
      <Routes>
        <Route path="/pathfinder" element={<Pathfinder />} />
        <Route path="*" element={<Navigate to="/pathfinder" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/history" element={<History />} />
      <Route path="/events" element={<Events />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/pathfinder" element={<Pathfinder />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppModeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
