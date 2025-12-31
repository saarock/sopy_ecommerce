"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Store, Menu, X, ChevronDown } from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { cart, fetchCart, getCartCount } = useCartStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate("/")
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }

  // Determine if we should force a solid background (e.g. on non-home pages if desired, or just always use a consistent style)
  // For this premium look, we'll use a glass effect that is always visible but stronger on scroll.
  const navClass = isScrolled
    ? "bg-white/90 backdrop-blur-md shadow-md border-b border-zinc-200/50 py-3"
    : "bg-white/70 backdrop-blur-sm border-b border-transparent py-4"

  const linkClass = (path) => `
    font-medium transition-all duration-200 relative group px-3 py-1 
    ${location.pathname === path ? "text-primary-600" : "text-zinc-600 hover:text-primary-600"}
  `

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary-600 to-emerald-600 p-2 rounded-xl shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-105">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700">
              Sopy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass("/")}>
              Home
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${location.pathname === "/" ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
            <Link to="/products" className={linkClass("/products")}>
              Products
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${location.pathname === "/products" ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>

            <div className="h-6 w-px bg-zinc-200 mx-2"></div>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/cart"
                  className="relative p-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors group"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:text-primary-600 transition-colors" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm ring-2 ring-white">
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                <div className="relative z-50">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setUserMenuOpen(false)}></div>
                      <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 animate-fade-in origin-top-right z-50">
                        <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/50">
                          <p className="text-sm font-semibold text-zinc-900 truncate">{user.name}</p>
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

                        <div className="p-2 border-t border-zinc-100 mt-1">
                          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-primary-600 transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white bg-primary-600 rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Visible only on small screens */}
          <div className="flex items-center gap-4 md:hidden">
            {user && (
              <Link
                to="/cart"
                className="relative p-2 text-zinc-600 hover:text-primary-600"
              >
                <ShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}
            <button
              className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-[60px] left-0 right-0 bg-white border-b border-zinc-200 shadow-xl animate-slide-down"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-zinc-900 truncate">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <Link to="/" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-primary-600 rounded-xl font-medium transition-colors">
                <Store className="w-5 h-5" /> Home
              </Link>
              <Link to="/products" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-primary-600 rounded-xl font-medium transition-colors">
                <Package className="w-5 h-5" /> Products
              </Link>

              <div className="border-t border-zinc-100 my-2"></div>

              {user ? (
                <>
                  <Link to="/cart" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-primary-600 rounded-xl font-medium transition-colors">
                    <ShoppingCart className="w-5 h-5" /> Cart ({getCartCount()})
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-primary-600 rounded-xl font-medium transition-colors">
                    <Package className="w-5 h-5" /> My Orders
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-primary-600 rounded-xl font-medium transition-colors">
                    <User className="w-5 h-5" /> Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-primary-600 rounded-xl font-medium transition-colors">
                      <LayoutDashboard className="w-5 h-5" /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors mt-2">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-4 px-2">
                  <Link to="/login" className="btn-secondary justify-center">Log in</Link>
                  <Link to="/register" className="btn-primary justify-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
