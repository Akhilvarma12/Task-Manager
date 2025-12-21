import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardList, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks } from '@/store/tasksSlice';
import { selectFilteredTasks } from '@/store/selectors';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectFilteredTasks);
  const loading = useAppSelector((state) => state.tasks.loading);
  const error = useAppSelector((state) => state.tasks.error);
  const filter = useAppSelector((state) => state.tasks.filter);
  const searchQuery = useAppSelector((state) => state.tasks.searchQuery);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-muted-foreground"
      >
        <ClipboardList className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium mb-1">No tasks found</p>
        <p className="text-sm">
          {searchQuery
            ? `No tasks matching "${searchQuery}"`
            : filter !== 'all'
            ? `No ${filter} tasks yet`
            : 'Add your first task to get started'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  );
};
