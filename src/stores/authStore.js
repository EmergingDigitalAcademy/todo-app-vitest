import { create } from "zustand";
import axios from "../config/axios";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  register: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/users/register", {
        username,
        password,
      });
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Registration failed",
        isLoading: false,
      });
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/users/login", {
        username,
        password,
      });
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Login failed",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post("/api/users/logout");
      set({ user: null, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Logout failed",
        isLoading: false,
      });
    }
  },

  checkAuth: async () => {
    try {
      const response = await axios.get("/api/users/current");
      set({ user: response.data });
    } catch (error) {
      set({ user: null });
    }
  },
}));

export default useAuthStore; 