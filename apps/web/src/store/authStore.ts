/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v0",
  withCredentials: true,
});

interface User {
  id: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError?: boolean;
  errorMessage?: string;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const userAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isError: false,
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/auth/me");
      if (response.data?.user) {
        set({
          user: response.data?.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error: any) {
      console.error("Not authenticated");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isError: true,
        errorMessage: error,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        isError: false,
        errorMessage: undefined
      });
    } catch (error: any) {
      console.error("Error during logout:", error);
      // Even if the API call fails, clear the local state
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        isError: false,
        errorMessage: undefined
      });
    }
  },
}));
