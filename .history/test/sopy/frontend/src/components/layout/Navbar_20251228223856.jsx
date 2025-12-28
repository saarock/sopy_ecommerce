"use client"

import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Store } from "lucide-react"
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
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ShopHub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
            </Link>
            <Link
              to="/products"
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-slate-600" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                {/* Admin Dashboard Link */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Admin Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5 text-slate-600" />
                  </Link>
                )}

                {/* Orders Link */}
                <Link to="/orders" className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="My Orders">
                  <Package className="w-5 h-5 text-slate-600" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:block text-slate-700 font-medium">{user.name}</span>
                  </button>
                  <div className="absolute top-5 right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
                >
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
