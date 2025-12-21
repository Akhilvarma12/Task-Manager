import { useState } from 'react';
import { Check, Edit2, Trash2, X, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { useAppDispatch } from '@/store';
import { updateTask, deleteTask } from '@/store/tasksSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    setIsUpdating(true);
    try {
      await dispatch(updateTask({ id: task.id, updates: { status: newStatus } })).unwrap();
      toast({
        title: newStatus === 'completed' ? 'Task completed!' : 'Task reopened',
        description: task.title,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      toast({
        title: 'Error',
        description: 'Task title is required',
        variant: 'destructive',
      });
      return;
    }

    if (trimmedTitle === task.title) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await dispatch(updateTask({ id: task.id, updates: { title: trimmedTitle } })).unwrap();
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      toast({
        title: 'Deleted',
        description: 'Task removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group flex items-center gap-3 p-4 bg-card rounded-lg border border-border task-shadow',
        'hover:task-shadow-hover transition-all duration-200',
        task.status === 'completed' && 'opacity-75'
      )}
    >
      {/* Checkbox */}
      <Checkbox
        checked={task.status === 'completed'}
        onCheckedChange={handleToggleStatus}
        disabled={isUpdating}
        className={cn(
          'h-5 w-5 rounded-full border-2 transition-colors',
          task.status === 'completed'
            ? 'bg-success border-success text-success-foreground'
            : 'border-muted-foreground'
        )}
      />

      {/* Title */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              disabled={isUpdating}
              autoFocus
              className="h-8 bg-background"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSaveEdit}
              disabled={isUpdating}
              className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCancelEdit}
              disabled={isUpdating}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span
            className={cn(
              'block truncate text-foreground transition-all',
              task.status === 'completed' && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Status Badge */}
      {!isEditing && (
        <span
          className={cn(
            'hidden sm:inline-flex px-2.5 py-1 text-xs font-medium rounded-full',
            task.status === 'completed'
              ? 'bg-success/10 text-success'
              : 'bg-warning/10 text-warning'
          )}
        >
          {task.status === 'completed' ? 'Completed' : 'Pending'}
        </span>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className="h-8 w-8"
            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.status === 'completed' ? (
              <RotateCcw className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            disabled={isUpdating}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                disabled={isUpdating}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{task.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </motion.div>
  );
};
