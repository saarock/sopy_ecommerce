"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { NavLink } from "react-router-dom"
import { setError } from "../../features/auth/authSlice"
import { handleResponse } from "../../utils"
import { Auth } from "../../services"
import useTopLoader from "../../hooks/useTopLoader"
import useUser from "../../hooks/useUser"

// Import icons
import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaTachometerAlt,
  FaSignOutAlt,
  FaPaintRoller,
  FaBars,
  FaTimes,
  FaBox,
  FaLifeRing,
} from "react-icons/fa"
import logoutFromClientSide from "../../utils/logOut"

const Header = () => {
  const auth = useSelector((state) => state.auth)
  const { user } = useUser()
  const dispatch = useDispatch()
  const { topLoaderNumber } = useTopLoader()

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const nav = [
    { id: "home", name: "Home", slug: "/", icon: <FaHome />, userActive: true },
    {
      id: "support",
      name: "Support",
      slug: "/support",
      icon: <FaLifeRing />,
      userActive: true,
    },
    {
      id: "login",
      name: "Login",
      slug: "/login",
      icon: <FaSignInAlt />,
      userActive: !auth.isAuthenticated,
    },
    {
      id: "register",
      name: "Register",
      slug: "/register",
      icon: <FaUserPlus />,
      userActive: !auth.isAuthenticated,
    },
    {
      id: "products",
      name: "Products",
      slug: `/products`,
      icon: <FaPaintRoller />,
      userActive: auth.isAuthenticated,
    },
    {
      id: "dashboard",
      name: "Dashboard",
      slug: `${user?.role === "admin" ? "/admin/dashboard/add-product" : "/user/dashboard/profile"}`,
      icon: <FaTachometerAlt />,
      userActive: auth.isAuthenticated,
    },
    {
      id: "logout",
      name: "Logout",
      slug: "/logout",
      icon: <FaSignOutAlt />,
      userActive: auth.isAuthenticated,
    },
  ]

  const handleLogout = async () => {
    try {
      const response = await handleResponse(Auth.logout({ user: localStorage.getItem("userData") }))
      if (response.error) logoutFromClientSide()
      logoutFromClientSide()
    } catch (error) {
      dispatch(setError(error.message))
    }
  }

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prevState) => !prevState)
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#101540] via-[#1a2060] to-[#101540] z-50 transition-all duration-500 ease-out shadow-[0_0_25px_rgba(16,21,64,0.8)]"
        style={{ width: `${topLoaderNumber}%` }}
      />

      <header className="sticky top-0 z-40 w-full border-b border-[rgba(16,21,64,0.1)] bg-white/98 backdrop-blur-xl shadow-[0_4px_20px_rgba(16,21,64,0.08)]">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 md:h-18 lg:h-20 items-center justify-between gap-2 sm:gap-4">
            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-[#101540] rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
                <div className="relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-2xl bg-gradient-to-br from-[#101540] to-[#1a2060] flex items-center justify-center shadow-lg shadow-[rgba(16,21,64,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[rgba(16,21,64,0.5)] group-hover:rotate-3">
                  <FaBox className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl" />
                </div>
              </div>
              <span className="hidden sm:block text-sm sm:text-base md:text-lg lg:text-xl font-bold bg-gradient-to-r from-[#101540] to-[#1a2060] bg-clip-text text-transparent whitespace-nowrap">
                Inventory System
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-1 justify-end">
              {nav.map(
                (link) =>
                  link.userActive &&
                  (link.id === "logout" ? (
                    <button
                      key={link.id}
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-gray-600 hover:text-red-600 transition-all duration-300 hover:bg-red-50 rounded-xl group relative overflow-hidden min-h-[44px]"
                    >
                      <span className="relative z-10 text-base lg:text-lg transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[15deg]">
                        {link.icon}
                      </span>
                      <span className="relative z-10 hidden lg:inline">Logout</span>
                      <div className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-50 transition-all duration-300 scale-0 group-hover:scale-100" />
                    </button>
                  ) : (
                    <NavLink
                      key={link.id}
                      to={link.slug}
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold transition-all duration-300 rounded-xl group relative overflow-hidden min-h-[44px] ${isActive
                          ? "text-white shadow-lg shadow-[rgba(16,21,64,0.4)]"
                          : "text-gray-600 hover:text-[#101540] hover:bg-[rgba(16,21,64,0.05)]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#101540] to-[#1a2060] animate-gradient" />
                          )}
                          <span
                            className={`relative z-10 text-base lg:text-lg transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-125 group-hover:rotate-[10deg]"
                              }`}
                          >
                            {link.icon}
                          </span>
                          <span className="relative z-10 hidden lg:inline">{link.name}</span>
                        </>
                      )}
                    </NavLink>
                  )),
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileNav}
              className="md:hidden relative z-50 p-2.5 sm:p-3 text-gray-700 hover:text-[#101540] hover:bg-[rgba(16,21,64,0.05)] rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6 sm:w-7 sm:h-7">
                <FaBars
                  size={24}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isMobileNavOpen ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"
                    }`}
                />
                <FaTimes
                  size={24}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isMobileNavOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"
                    }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 top-14 sm:top-16 bg-white/98 backdrop-blur-2xl z-40 transition-all duration-500 ${isMobileNavOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-8"
            }`}
        >
          <nav className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-2 sm:gap-2.5 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
            {nav.map(
              (link, index) =>
                link.userActive &&
                (link.id === "logout" ? (
                  <button
                    key={link.id}
                    onClick={() => {
                      handleLogout()
                      setIsMobileNavOpen(false)
                    }}
                    className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 hover:text-red-600 transition-all duration-300 hover:bg-red-50 rounded-2xl group relative overflow-hidden shadow-sm hover:shadow-md border border-transparent hover:border-red-100 min-h-[52px] sm:min-h-[56px]"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMobileNavOpen ? "slideIn 0.5s ease-out forwards" : "none",
                    }}
                  >
                    <span className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-[15deg] text-xl sm:text-2xl">
                      {link.icon}
                    </span>
                    <span className="text-base sm:text-lg">Logout</span>
                    <div className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  </button>
                ) : (
                  <NavLink
                    key={link.id}
                    to={link.slug}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-300 rounded-2xl group relative overflow-hidden min-h-[52px] sm:min-h-[56px] ${isActive
                        ? "text-white shadow-lg shadow-[rgba(16,21,64,0.3)] border border-[rgba(16,21,64,0.2)]"
                        : "text-gray-700 hover:text-[#101540] hover:bg-[rgba(16,21,64,0.05)] shadow-sm hover:shadow-md border border-transparent hover:border-[rgba(16,21,64,0.1)]"
                      }`
                    }
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMobileNavOpen ? "slideIn 0.5s ease-out forwards" : "none",
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <div className="absolute inset-0 bg-gradient-to-br from-[#101540] to-[#1a2060]" />}
                        <span
                          className={`relative z-10 text-xl sm:text-2xl transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-125 group-hover:rotate-[10deg]"
                            }`}
                        >
                          {link.icon}
                        </span>
                        <span className="relative z-10 text-base sm:text-lg">{link.name}</span>
                      </>
                    )}
                  </NavLink>
                )),
            )}
          </nav>
        </div>
      </header>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  )
}

export default Header
