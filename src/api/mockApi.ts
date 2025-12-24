import { Task } from '@/types/task';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initial mock data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Buy groceries for the week',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    title: 'Go for evening basketball practice',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Finish pending office work',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '4',
    title: 'Clean room and organize desk',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Watch one episode of a favorite series',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


// In-memory storage
let tasks: Task[] = [...initialTasks];

export const mockApi = {
  // Fetch all tasks
  fetchTasks: async (): Promise<Task[]> => {
    await delay(300);
    return [...tasks];
  },

  // Add a new task
  addTask: async (title: string): Promise<Task> => {
    await delay(200);
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks = [newTask, ...tasks];
    return newTask;
  },

  // Update a task
  updateTask: async (id: string, updates: Partial<Pick<Task, 'title' | 'status'>>): Promise<Task> => {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return tasks[index];
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await delay(200);
    tasks = tasks.filter(t => t.id !== id);
  },
};
