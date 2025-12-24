import { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { store, useAppSelector } from "./store";
import TaskDashboard from "./pages/TaskDashboard";

/* ---------------------------------- */
/* Theme Provider */
/* ---------------------------------- */

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
};

/* ---------------------------------- */
/* App Content */
/* ---------------------------------- */

const AppContent = () => (
  <ThemeProvider>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskDashboard />} />
        </Routes>
      </BrowserRouter>

      {/* Global Toasts */}
      <Toaster />
    </TooltipProvider>
  </ThemeProvider>
);

/* ---------------------------------- */
/* App Root */
/* ---------------------------------- */

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
