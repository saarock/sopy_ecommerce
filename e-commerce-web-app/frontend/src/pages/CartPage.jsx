"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCartStore } from "../store/cartStore"

export default function CartPage() {
  const { cart, fetchCart, updateCartItem, removeFromCart, loading } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">Add some products to get started!</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.product._id} className="card flex gap-4">
              <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                  {item.product.images?.[0]?.url ? (
                    <img
                      src={item.product.images[0].url || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1">
                <Link
                  to={`/products/${item.product._id}`}
                  className="font-semibold text-lg hover:text-primary-600 block mb-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-gray-600 text-sm mb-2">${item.price.toFixed(2)} each</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-primary-600">${(item.price * item.quantity).toFixed(2)}</p>
                {item.quantity >= item.product.stock && <p className="text-xs text-red-600 mt-1">Max stock reached</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{cart.totalAmount > 100 ? "FREE" : "$10.00"}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${(cart.totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">
                  ${(cart.totalAmount + (cart.totalAmount > 100 ? 0 : 10) + cart.totalAmount * 0.1).toFixed(2)}
                </span>
              </div>
            </div>

            {cart.totalAmount < 100 && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Add ${(100 - cart.totalAmount).toFixed(2)} more for free shipping!
              </p>
            )}

            <button
              onClick={() => navigate("/checkout")}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link to="/products" className="block text-center text-primary-600 hover:text-primary-700 mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
