import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import userService from "../../services/userService";
import {
  FaUtensils,
  FaPlusCircle,
  FaUsersCog,
  FaDeviantart,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaBell,
  FaChartBar,
  FaLifeRing,
} from "react-icons/fa";

import useSocket from "../../hooks/useSocket";

const AdminDashBoardNav = () => {
  const user = useSelector((state) => state.auth.user);
  const { numberOfNotifications: unreadCount } = useSocket();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = useLocation().pathname;

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const navLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaChartBar />,
    },
    {
      name: "Add Product",
      path: "/admin/dashboard/add-product",
      icon: <FaUtensils />,
    },
    {
      name: "Manage Product",
      path: "/admin/dashboard/manage-product",
      icon: <FaPlusCircle />,
    },
    {
      name: "Manage Users",
      path: "/admin/dashboard/manage-users",
      icon: <FaUsersCog />,
    },
    {
      name: "Notifications",
      path: "/admin/dashboard/notifications",
      icon: <FaBell />,
      badge: unreadCount,
    },
    {
      name: "My details",
      path: "/admin/dashboard/my-details",
      icon: <FaDeviantart />,
    },
    {
      name: "Manage booked product",
      path: "/admin/dashboard/manage-booked-product",
      icon: <FaDeviantart />,
    },
    {
      name: "Support",
      path: "/support",
      icon: <FaLifeRing />,
    },
  ];

  const isActive = (path) => pathname === path;

  return (
    <div className="sticky top-0">
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-20 left-4 p-3 rounded-2xl bg-gradient-to-br from-[#101540] to-[#1a2060] text-white shadow-xl shadow-[rgba(16,21,64,0.4)] hover:shadow-2xl hover:shadow-[rgba(16,21,64,0.6)] transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Toggle sidebar"
      >
        <div className="relative w-6 h-6">
          <FaBars
            size={24}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isSidebarOpen
              ? "opacity-0 rotate-180 scale-0"
              : "opacity-100 rotate-0 scale-100"
              }`}
          />
          <FaTimes
            size={24}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isSidebarOpen
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-180 scale-0"
              }`}
          />
        </div>
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={` h-screen bg-white border-r border-[rgba(16,21,64,0.1)] shadow-2xl shadow-[rgba(16,21,64,0.1)] transition-all duration-500 ease-in-out ${isSidebarOpen
          ? "fixed inset-0 z-40 translate-x-0"
          : "fixed -translate-x-full z-40"
          } lg:relative lg:translate-x-0 lg:z-auto w-[280px] sm:w-[320px] lg:w-[280px] xl:w-[300px]`}
      >
        <div className="flex flex-col h-full">
          {/* User Info Section */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-br from-[#101540] via-[#1a2060] to-[#101540] overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-white/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-all duration-300 overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Admin avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-white text-3xl sm:text-4xl" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-lg sm:text-xl truncate mb-1">
                  {user?.fullName || "Admin"}
                </h2>
                <p className="text-white/70 text-xs sm:text-sm font-medium">
                  Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
            {navLinks.map((link, index) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${active
                    ? "bg-gradient-to-br from-[#101540] to-[#1a2060] text-white shadow-lg shadow-[rgba(16,21,64,0.3)]"
                    : "text-gray-700 hover:bg-[rgba(16,21,64,0.05)] hover:text-[#101540]"
                    }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Active background animation */}
                  {active && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </>
                  )}

                  {/* Icon */}
                  <span
                    className={`relative z-10 text-xl sm:text-2xl transition-all duration-300 ${active
                      ? "scale-110"
                      : "group-hover:scale-125 group-hover:rotate-12 group-hover:text-[#101540]"
                      }`}
                  >
                    {link.icon}
                  </span>

                  {/* Link Text */}
                  <span className="relative z-10 font-semibold text-sm sm:text-base flex-1">
                    {link.name}
                  </span>

                  {/* Notification Badge */}
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="relative z-10 flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-500/50">
                      {link.badge}
                    </span>
                  )}

                  {/* Active indicator */}
                  {active && !link.badge && (
                    <div className="relative z-10 w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse" />
                  )}

                  {/* Hover glow */}
                  {!active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(16,21,64,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="p-4 sm:p-6 border-t border-[rgba(16,21,64,0.1)]">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[rgba(16,21,64,0.05)] to-[rgba(16,21,64,0.02)] border border-[rgba(16,21,64,0.1)] relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[rgba(16,21,64,0.05)] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <p className="relative z-10 text-xs text-gray-600 font-medium">
                Admin Dashboard v1.0
              </p>
              <p className="relative z-10 text-xs text-gray-400 mt-1">
                © 2025 Inventory System
              </p>
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        /* Custom scrollbar */
        nav::-webkit-scrollbar {
          width: 6px;
        }

        nav::-webkit-scrollbar-track {
          background: rgba(16, 21, 64, 0.05);
          border-radius: 10px;
        }

        nav::-webkit-scrollbar-thumb {
          background: rgba(16, 21, 64, 0.2);
          border-radius: 10px;
        }

        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 21, 64, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminDashBoardNav;
