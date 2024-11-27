import { create } from "zustand";
import axios from "../config/axios";

const API_BASE = "/api/todos";

const useTodoStore = create((set, get) => ({
  // State
  todos: [],
  isLoading: false,
  error: null,

  // Actions
  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_BASE);
      set({ todos: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTodo: async (todo) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(API_BASE, todo);
      // Fetch all todos to ensure we have the latest data
      // Alternative: we could optimize by adding the new todo to the state directly
      await get().fetchTodos();
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateTodo: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_BASE}/${id}`, updates);
      // Update local state
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, ...updates } : todo
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE}/${id}`);
      // Update local state
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Helper action to mark a todo as complete
  completeTodo: async (id) => {
    const completed_at = new Date().toISOString();
    await get().updateTodo(id, { completed_at });
  },

  incompleteTodo: async (id) => {
    await get().updateTodo(id, { completed_at: null });
  },
}));

export default useTodoStore;
