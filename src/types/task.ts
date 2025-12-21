export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export type TaskFilter = 'all' | 'completed' | 'pending';
