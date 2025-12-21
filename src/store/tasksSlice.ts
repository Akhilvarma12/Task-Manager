import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskFilter } from '@/types/task';
import { mockApi } from '@/api/mockApi';

interface TasksState {
  items: Task[];
  filter: TaskFilter;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  filter: 'all',
  searchQuery: '',
  loading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  return await mockApi.fetchTasks();
});

export const addTask = createAsyncThunk('tasks/addTask', async (title: string) => {
  return await mockApi.addTask(title);
});

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Pick<Task, 'title' | 'status'>> }) => {
    return await mockApi.updateTask(id, updates);
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  await mockApi.deleteTask(id);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TaskFilter>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Add task
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setFilter, setSearchQuery } = tasksSlice.actions;
export default tasksSlice.reducer;
