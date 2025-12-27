"use client"

import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User, LogOut, Package, LayoutDashboard } from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
import { useEffect } from "react"

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { cart, fetchCart, getCartCount } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">ShopHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-primary-600 transition-colors">
              Products
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Cart Icon */}
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-primary-600 transition-colors" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                {/* Admin Dashboard Link */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                    title="Admin Dashboard"
                  >
                    <LayoutDashboard className="w-6 h-6" />
                  </Link>
                )}

                {/* Orders Link */}
                <Link to="/orders" className="text-gray-600 hover:text-primary-600 transition-colors" title="My Orders">
                  <Package className="w-6 h-6" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                    <User className="w-6 h-6" />
                    <span className="hidden md:block">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
