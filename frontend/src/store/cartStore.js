import { create } from "zustand"
import api from "../lib/api"
import toast from "react-hot-toast"

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true })
    try {
      const { data } = await api.get("/cart")
      set({ cart: data.data, loading: false })
    } catch (error) {
      set({ loading: false })
      console.error("Fetch cart error:", error)
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const { data } = await api.post("/cart/items", { productId, quantity })
      set({ cart: data.data })
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart")
      throw error
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/items/${productId}`, { quantity })
      set({ cart: data.data })
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart")
      throw error
    }
  },

  removeFromCart: async (productId) => {
    try {
      const { data } = await api.delete(`/cart/items/${productId}`)
      set({ cart: data.data })
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item")
      throw error
    }
  },

  clearCart: async () => {
    try {
      await api.delete("/cart")
      set({ cart: { items: [], totalAmount: 0 } })
      toast.success("Cart cleared")
    } catch (error) {
      toast.error("Failed to clear cart")
    }
  },

  getCartCount: () => {
    const { cart } = get()
    return cart?.items?.filter(item => item.product).reduce((total, item) => total + item.quantity, 0) || 0
  },
}))
