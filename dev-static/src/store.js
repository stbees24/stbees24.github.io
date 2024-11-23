// A simple Svelte store implementation with update methods and initial data.
// A true app would be more complex and separated into different files.

import { writable } from "svelte/store";

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

const TaskBox = () => {
  // Creates a new writable store populated with some initial data
  const { subscribe, update } = writable({
    tasks: defaultTasks,
    status: 'idle',
    error: false,
  });
  return {
    subscribe,
    // Method to archive a task, think of a action with redux or Pinia
    archiveTask: (id) =>
      update((store) => {
        const filteredTasks = store.tasks
          .map((task) =>
            task.id === id ? { ...task, state: 'TASK_ARCHIVED' } : task
          )
          .filter((t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');

        return { ...store, tasks: filteredTasks };
      }),
    // Method to archive a task, think of a action with redux or Pinia
    pinTask: (id) => {
      update((store) => {
        const task = store.tasks.find((t) => t.id === id);
        if (task) {
          task.state = 'TASK_PINNED';
        }
        return store;
      });
    },
   isError: () => update((store) => ({ ...store, error: true })),
  };
};
export const taskStore = TaskBox();
