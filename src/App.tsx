import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store, useAppSelector } from "./store";
import TaskDashboard from "./pages/TaskDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Theme provider that syncs Redux state with DOM
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

const AppContent = () => (
  <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  </Provider>
);

export default App;
