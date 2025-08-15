import { create } from "zustand";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types/task";

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API Actions
  createTask: (taskData: CreateTaskRequest) => Promise<Task>;
  fetchTasks: () => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  updateTaskById: (id: string, taskData: UpdateTaskRequest) => Promise<Task>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();
      get().addTask(newTask);
      return newTask;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create task";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      set({ tasks: data.tasks || [] });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tasks";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  removeTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      get().deleteTask(id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete task";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaskById: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();
      get().updateTask(id, updatedTask);
      return updatedTask;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update task";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
