"use client"

import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Store, Menu, X } from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { cart, fetchCart, getCartCount } = useCartStore()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCart()
      // Refresh cart every 30 seconds to keep in sync
      const interval = setInterval(fetchCart, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate("/")
    setMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20" : "bg-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary-600 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-110">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 ${!isScrolled && "md:text-white md:drop-shadow-sm"}`}>
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {["Home", "Products"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={`font-medium transition-all duration-200 relative group px-3 py-1 ${isScrolled ? "text-zinc-600 hover:text-primary-600" : "text-zinc-100 hover:text-white"
                  }`}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/cart"
                  className={`relative p-2.5 rounded-full transition-all duration-200 ${isScrolled ? "hover:bg-zinc-100 text-zinc-600" : "hover:bg-white/10 text-white"
                    }`}
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                <div className="relative group z-50">
                  <button className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${isScrolled ? "hover:bg-zinc-100" : "hover:bg-white/10"
                    }`}>
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white/50">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute top-12 right-0 w-60 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 hidden group-hover:block animate-fade-in origin-top-right">
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      {user.role === "admin" && (
                        <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                    </div>

                    <div className="p-2 border-t border-zinc-100">
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className={`font-medium transition-colors ${isScrolled ? "text-zinc-600 hover:text-primary-600" : "text-white hover:text-primary-200"
                  }`}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-700 px-5 py-2.5 rounded-full font-bold shadow-lg shadow-white/20 hover:bg-zinc-50 hover:scale-105 transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg ${isScrolled ? "text-zinc-800" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-zinc-200 shadow-xl animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-zinc-600 hover:bg-zinc-50 rounded-lg">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-zinc-600 hover:bg-zinc-50 rounded-lg">Products</Link>
            {user ? (
              <>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-zinc-600 hover:bg-zinc-50 rounded-lg">Cart ({getCartCount()})</Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-zinc-600 hover:bg-zinc-50 rounded-lg">My Orders</Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-zinc-600 hover:bg-zinc-50 rounded-lg">Profile</Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-zinc-600 hover:bg-zinc-50 rounded-lg">Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary justify-center">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary justify-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
