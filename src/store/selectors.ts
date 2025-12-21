import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

const selectTasks = (state: RootState) => state.tasks.items;
const selectFilter = (state: RootState) => state.tasks.filter;
const selectSearchQuery = (state: RootState) => state.tasks.searchQuery;

export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilter, selectSearchQuery],
  (tasks, filter, searchQuery) => {
    let filtered = tasks;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter((task) => task.status === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectTaskStats = createSelector([selectTasks], (tasks) => ({
  total: tasks.length,
  completed: tasks.filter((t) => t.status === 'completed').length,
  pending: tasks.filter((t) => t.status === 'pending').length,
}));
