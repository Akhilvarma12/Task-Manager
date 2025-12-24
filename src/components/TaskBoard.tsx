import { useEffect, useState } from "react";
import { Search, X, Plus, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
    fetchTasks,
    setFilter,
    setSearchQuery,
    addTask,
} from "@/store/tasksSlice";
import {
    selectFilteredTasks,
    selectTaskStats,
} from "@/store/selectors";
import { TaskFilter } from "@/types/task";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { TaskList } from "./TaskList";

/* ---------------------------------- */
/* Constants */
/* ---------------------------------- */

const FILTERS: { value: TaskFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
];

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export const TaskBoard = () => {
    const dispatch = useAppDispatch();

    const tasks = useAppSelector(selectFilteredTasks);
    const stats = useAppSelector(selectTaskStats);
    const { loading, error, filter, searchQuery } = useAppSelector(
        (state) => state.tasks
    );

    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ---------- Effects ---------- */

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    /* ---------- Helpers ---------- */

    const getCount = (filter: TaskFilter) => {
        switch (filter) {
            case "all":
                return stats.total;
            case "completed":
                return stats.completed;
            case "pending":
                return stats.pending;
        }
    };

    /* ---------- Handlers ---------- */

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = title.trim();
        if (!trimmed) {
            toast({
                title: "Error",
                description: "Task title is required",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(addTask(trimmed)).unwrap();
            setTitle("");
            toast({
                title: "Success",
                description: "Task added successfully",
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to add task",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------------------------------- */
    /* Render */
    /* ---------------------------------- */

    return (
        <section className="space-y-8">
            {/* Header with gradient accent */}
            <div className="
  relative overflow-hidden rounded-2xl
  bg-card/80
  border border-border/60
  p-6
  backdrop-blur-md
  shadow-lg shadow-black/20
">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                <div className="relative flex gap-3">
                    <div className="relative flex-1">
                        <Input
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddTask(e);
                                }
                            }}
                            className="
    h-12
    text-base
    border border-violet-300/30
    bg-background/40 dark:bg-background/30
    text-foreground
    placeholder:text-muted-foreground/70
    backdrop-blur-md
    focus:bg-background/60
    focus:border-violet-400
    focus:ring-2 focus:ring-violet-400/20
    transition-all
  "
                        />

                    </div>
                    <Button
                        onClick={handleAddTask}
                        disabled={!title.trim() || isSubmitting}
                        className="h-12 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Add Task
                    </Button>
                </div>
            </div>

            {/* Search and Filters Card */}
            <div className="rounded-xl bg-card border shadow-sm p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 lg:max-w-md">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                        <Input
                            placeholder="Search your tasks..."
                            value={searchQuery}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            className="h-11 pl-10 pr-10 border-0 bg-muted/50 focus:bg-muted/80 transition-colors"
                        />
                        {searchQuery && (
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => dispatch(setSearchQuery(""))}
                                className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 hover:bg-background"
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* Filters - Pill style */}
                    <div className="flex gap-2">
                        {FILTERS.map((f) => {
                            const isActive = filter === f.value;

                            return (
                                <button
                                    key={f.value}
                                    onClick={() => dispatch(setFilter(f.value))}
                                    className={cn(
                                        "relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25 text-white"
                                            : "bg-background/40 text-muted-foreground hover:bg-background/60 hover:text-foreground"

                                    )}
                                >
                                    <span>{f.label}</span>

                                    <span
                                        className={cn(
                                            "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                                            isActive
                                                ? "bg-white/20 text-white"
                                                : "bg-background text-foreground"
                                        )}
                                    >
                                        {getCount(f.value)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <div className="relative">
                        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
                        <div className="absolute inset-0 h-10 w-10 animate-ping text-violet-600/20">
                            <Loader2 className="h-10 w-10" />
                        </div>
                    </div>
                    <p className="mt-4 text-sm font-medium">Loading tasks...</p>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
                    <p className="text-sm font-medium text-destructive">Error: {error}</p>
                </div>
            ) : tasks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/20 py-20"
                >
                    <div className="rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-4 mb-4">
                        <Sparkles className="h-10 w-10 text-violet-600" />
                    </div>
                    <p className="text-lg font-semibold mb-2">No tasks found</p>
                    <p className="text-sm text-muted-foreground max-w-sm text-center">
                        {searchQuery
                            ? `No tasks matching "${searchQuery}"`
                            : filter !== "all"
                                ? `No ${filter} tasks yet`
                                : "Start fresh by adding your first task above"}
                    </p>
                </motion.div>
            ) : (
                <TaskList tasks={tasks} />
            )}
        </section>
    );
};