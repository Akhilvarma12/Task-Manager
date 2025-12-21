import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { addTask } from '@/store/tasksSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export const TaskForm = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast({
        title: 'Error',
        description: 'Task title is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(addTask(trimmedTitle)).unwrap();
      setTitle('');
      toast({
        title: 'Success',
        description: 'Task added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add task',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
        className="flex-1 h-11 bg-card border-border"
      />
      <Button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="h-11 px-5"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </form>
  );
};
