import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme } from '@/store/themeSlice';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => dispatch(toggleTheme())}
      className="relative h-10 w-10 rounded-full"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'light' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </motion.div>
    </Button>
  );
};
