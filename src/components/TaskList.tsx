import { useState } from "react";
import {
  Check,
  Edit2,
  RotateCcw,
  Trash2,
  X,
  Circle,
  CheckCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store";
import { deleteTask, updateTask } from "@/store/tasksSlice";
import { Task } from "@/types/task";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog";

interface TaskListProps {
  tasks: Task[];
}

export const TaskList = ({ tasks }: TaskListProps) => (
  <div className="space-y-3">
    {tasks.map((task) => (
      <TaskRow key={task.id} task={task} />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Task Row */
/* ------------------------------------------------------------------ */

const TaskRow = ({ task }: { task: Task }) => {
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isSaving, setIsSaving] = useState(false);

  const isCompleted = task.status === "completed";

  /* ---------------- Actions ---------------- */

  const toggleStatus = async () => {
    setIsSaving(true);
    try {
      await dispatch(
        updateTask({
          id: task.id,
          updates: {
            status: isCompleted ? "pending" : "completed",
          },
        })
      ).unwrap();

      toast({
        title: isCompleted ? "Task reopened" : "Task completed",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveEdit = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      toast({
        title: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    if (trimmed === task.title) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        updateTask({ id: task.id, updates: { title: trimmed } })
      ).unwrap();
      setIsEditing(false);
      toast({ title: "Task updated" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      toast({ title: "Task deleted" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setTitle(task.title);
    setIsEditing(false);
  };

  /* ---------------- Render ---------------- */

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all",
        "animate-in fade-in slide-in-from-top-2 duration-300",
        isCompleted
          ? "border-emerald-300/40 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-border bg-card hover:border-violet-200/50 hover:shadow-md"

      )}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Toggle */}
        <button
          onClick={toggleStatus}
          disabled={isSaving}
          aria-label="Toggle task status"
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
            isCompleted
              ? "border-emerald-500 bg-emerald-500 shadow-emerald-500/25"
              : "border-muted-foreground/40 hover:border-violet-500 hover:bg-violet-50",
            isSaving && "opacity-50 cursor-not-allowed"
          )}
        >
          {isCompleted && (
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          )}
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                disabled={isSaving}
                autoFocus
                className="h-9"
              />
              <Button size="icon" variant="ghost" onClick={saveEdit}>
                <Check className="h-4 w-4 text-emerald-600" />
              </Button>
              <Button size="icon" variant="ghost" onClick={cancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "truncate text-[15px]",
                  isCompleted
                    ? "line-through text-foreground/80"
                    : "font-medium text-foreground"


                )}
              >
                {task.title}
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                  isCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                )}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Done
                  </>
                ) : (
                  <>
                    <Circle className="h-3 w-3" />
                    Todo
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 text-violet-600" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4 text-rose-600" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{task.title}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-rose-600 text-white hover:bg-rose-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};
