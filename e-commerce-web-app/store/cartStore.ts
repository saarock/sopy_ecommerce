import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import api from "../lib/api"

interface CartItem {
  product: any
  quantity: number
  _id?: string
}

interface CartState {
  items: CartItem[]
  loading: boolean
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      fetchCart: async () => {
        try {
          set({ loading: true })
          const data = await api.get("/api/cart")
          set({ items: data.items || [], loading: false })
        } catch (error) {
          set({ items: [], loading: false })
        }
      },

      addToCart: async (productId, quantity) => {
        try {
          const data = await api.post("/api/cart", { productId, quantity })
          set({ items: data.items })
        } catch (error) {
          throw error
        }
      },

      updateQuantity: async (productId, quantity) => {
        try {
          const data = await api.put("/api/cart", { productId, quantity })
          set({ items: data.items })
        } catch (error) {
          throw error
        }
      },

      removeFromCart: async (productId) => {
        try {
          const data = await api.delete(`/api/cart/${productId}`)
          set({ items: data.items })
        } catch (error) {
          throw error
        }
      },

      clearCart: () => {
        set({ items: [] })
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
