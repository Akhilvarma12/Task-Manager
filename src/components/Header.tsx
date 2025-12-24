import { CheckSquare, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectTaskStats } from "@/store/selectors";
import { toggleTheme } from "@/store/themeSlice";

export const Header = () => {
  const stats = useAppSelector(selectTaskStats);
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: App title & stats */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CheckSquare className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Task Manager
              </h1>
              <p className="text-xs text-muted-foreground">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>
          </div>

          {/* Right: Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
            className="relative h-10 w-10 rounded-full"
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.div>
          </Button>
        </div>
      </div>
    </header>
  );
};
