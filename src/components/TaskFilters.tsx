import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFilter } from '@/store/tasksSlice';
import { selectTaskStats } from '@/store/selectors';
import { TaskFilter } from '@/types/task';
import { motion } from 'framer-motion';

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

export const TaskFilters = () => {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector((state) => state.tasks.filter);
  const stats = useAppSelector(selectTaskStats);

  const getCount = (filter: TaskFilter) => {
    switch (filter) {
      case 'all':
        return stats.total;
      case 'completed':
        return stats.completed;
      case 'pending':
        return stats.pending;
    }
  };

  return (
    <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => dispatch(setFilter(filter.value))}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-md transition-colors',
            currentFilter === filter.value
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {currentFilter === filter.value && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-card rounded-md task-shadow"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {filter.label}
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                currentFilter === filter.value
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {getCount(filter.value)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};
