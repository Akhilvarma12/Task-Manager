import { CheckSquare } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAppSelector } from '@/store';
import { selectTaskStats } from '@/store/selectors';

export const Header = () => {
  const stats = useAppSelector(selectTaskStats);

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Task Manager</h1>
              <p className="text-xs text-muted-foreground">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
