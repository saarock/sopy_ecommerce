import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import api from "../lib/api"

interface User {
  _id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  loading: boolean
  register: (userData: any) => Promise<any>
  login: (credentials: any) => Promise<any>
  logout: () => Promise<void>
  getMe: () => Promise<void>
  updateProfile: (userData: any) => Promise<any>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,

      register: async (userData) => {
        set({ loading: true })
        try {
          const data = await api.post("/api/auth/register", userData)
          set({ user: data.data, loading: false })
          return data
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      login: async (credentials) => {
        set({ loading: true })
        try {
          const data = await api.post("/api/auth/login", credentials)
          set({ user: data.data, loading: false })
          return data
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await api.post("/api/auth/logout")
          set({ user: null })
        } catch (error) {
          console.error("Logout failed", error)
        }
      },

      getMe: async () => {
        try {
          const data = await api.get("/api/auth/me")
          set({ user: data.data })
        } catch (error) {
          set({ user: null })
        }
      },

      updateProfile: async (userData) => {
        try {
          const data = await api.put("/api/auth/update-profile", userData)
          set({ user: data.data })
          return data
        } catch (error) {
          throw error
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
