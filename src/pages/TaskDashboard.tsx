import { Header } from '@/components/Header';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { SearchBar } from '@/components/SearchBar';
import { TaskList } from '@/components/TaskList';
import { useAppSelector } from '@/store';
import { selectTaskStats } from '@/store/selectors';

const TaskDashboard = () => {
  const stats = useAppSelector(selectTaskStats);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Organize Your Tasks
            </h2>
            <p className="text-muted-foreground">
              Stay productive and keep track of everything you need to do
            </p>
          </section>

          {/* Stats Cards */}
          <section className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center task-shadow">
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center task-shadow">
              <p className="text-3xl font-bold text-success">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center task-shadow">
              <p className="text-3xl font-bold text-warning">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </section>

          {/* Add Task Form */}
          <section>
            <TaskForm />
          </section>

          {/* Filters and Search */}
          <section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TaskFilters />
            <div className="w-full sm:w-64">
              <SearchBar />
            </div>
          </section>

          {/* Task List */}
          <section>
            <TaskList />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Task Management Dashboard • Built with React & Redux Toolkit</p>
        </div>
      </footer>
    </div>
  );
};

export default TaskDashboard;
