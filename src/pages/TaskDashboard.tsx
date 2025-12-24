import { Header } from "@/components/Header";
import { TaskBoard } from "@/components/TaskBoard";
import { useAppSelector } from "@/store";
import { selectTaskStats } from "@/store/selectors";

const TaskDashboard = () => {
  const stats = useAppSelector(selectTaskStats);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Hero Section */}
          <section className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Manage Your Tasks
            </h2>
            <p className="text-muted-foreground">
              All your tasks, in one place
            </p>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 text-center task-shadow">
              <p className="text-3xl font-bold text-foreground">
                {stats.total}
              </p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 text-center task-shadow">
              <p className="text-3xl font-bold text-success">
                {stats.completed}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 text-center task-shadow">
              <p className="text-3xl font-bold text-warning">
                {stats.pending}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </section>

          {/* Task Feature */}
          <section>
            <TaskBoard />
          </section>
        </div>
      </main>
    </div>
  );
};

export default TaskDashboard;
