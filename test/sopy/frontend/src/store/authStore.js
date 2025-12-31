import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "../lib/api"
import toast from "react-hot-toast"

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,

      register: async (userData) => {
        set({ loading: true })
        try {
          const { data } = await api.post("/auth/register", userData)
          set({ user: data.data, loading: false })
          toast.success(data.message)
          return data
        } catch (error) {
          set({ loading: false })
          toast.error(error.response?.data?.message || "Registration failed")
          throw error
        }
      },

      login: async (credentials) => {
        set({ loading: true })
        try {
          const { data } = await api.post("/auth/login", credentials)
          set({ user: data.data, loading: false })
          toast.success(data.message)
          return data
        } catch (error) {
          set({ loading: false })
          toast.error(error.response?.data?.message || "Login failed")
          throw error
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout")
          set({ user: null })
          toast.success("Logged out successfully")
        } catch (error) {
          toast.error("Logout failed")
        }
      },

      getMe: async () => {
        try {
          const { data } = await api.get("/auth/me")
          set({ user: data.data })
        } catch (error) {
          set({ user: null })
        }
      },

      updateProfile: async (userData) => {
        try {
          const { data } = await api.put("/auth/update-profile", userData)
          set({ user: data.data })
          toast.success(data.message)
          return data
        } catch (error) {
          toast.error(error.response?.data?.message || "Update failed")
          throw error
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loading = false
        }
      },
    },
  ),
)
