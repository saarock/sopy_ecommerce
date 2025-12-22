

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import useUser from "../../hooks/useUser"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { user } = useUser()
  const isAuthenticated = !!user

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-20 right-20 w-96 h-96 bg-[#101540]/5 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute bottom-40 left-20 w-[500px] h-[500px] bg-[#101540]/3 rounded-full blur-3xl animate-pulse"
          style={{
            animationDelay: "1s",
            transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 md:px-8 lg:px-16 xl:px-24">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,21,64,0.08)_0%,transparent_50%)] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,21,64,0.05)_0%,transparent_40%)] animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#101540]/5 via-[#101540]/10 to-[#101540]/5 border border-[#101540]/10 hover:border-[#101540]/30 transition-all duration-300 cursor-pointer group animate-fade-in bg-[length:200%_100%] hover:bg-[length:100%_100%]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#101540] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#101540]" />
              </span>
              <span className="text-sm font-medium text-[#101540] group-hover:translate-x-0.5 transition-transform">
                New: AI-Powered Forecasting
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-[#101540] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
              >
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="bg-gradient-to-br from-[#101540] via-[#1a2158] to-[#101540] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                The complete platform
              </span>
              <br />
              <span className="text-[#101540]">to manage inventory</span>
            </h1>

            <p
              className="text-lg sm:text-xl text-gray-600 leading-relaxed text-pretty max-w-2xl animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Your team's toolkit to stop configuring and start innovating. Securely manage, track, and optimize
              inventory with enterprise-grade automation and real-time intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard/profile"}
                    className="group relative px-8 py-4 bg-[#101540] text-white rounded-xl font-semibold text-center overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#101540]/30 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Go to Dashboard
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a2158] via-[#101540] to-[#1a2158] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] group-hover:animate-shimmer" />
                  </Link>
                  <Link
                    to="/products"
                    className="group px-8 py-4 bg-white border-2 border-[#101540]/10 text-[#101540] rounded-xl font-semibold hover:border-[#101540]/30 hover:bg-gradient-to-br hover:from-[#101540]/5 hover:to-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden text-center"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Browse Products
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-70">
                        <path d="M3 3h10v10H3V3z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 6h10M6 3v10" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative px-8 py-4 bg-[#101540] text-white rounded-xl font-semibold text-center overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#101540]/30 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started Free
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a2158] via-[#101540] to-[#1a2158] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] group-hover:animate-shimmer" />
                  </Link>
                  <button className="group px-8 py-4 bg-white border-2 border-[#101540]/10 text-[#101540] rounded-xl font-semibold hover:border-[#101540]/30 hover:bg-gradient-to-br hover:from-[#101540]/5 hover:to-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Schedule Demo
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-70">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 5v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {[
                { value: "20 days", label: "saved on daily operations" },
                { value: "98%", label: "faster time to market" },
                { value: "300%", label: "increase in efficiency" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group space-y-1 p-4 rounded-xl hover:bg-gradient-to-br hover:from-[#101540]/5 hover:to-transparent transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-[#101540] to-[#1a2158] bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 text-pretty">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Mockup */}
          <div
            className="relative -top-40 animate-fade-in-up"
            style={{
              animationDelay: "0.2s",
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-[#101540]/20 via-[#101540]/10 to-transparent">
              <div
                className="absolute -inset-4 bg-gradient-to-br from-[#101540]/20 to-transparent rounded-3xl blur-3xl animate-pulse"
                style={{ animationDuration: "3s" }}
              />

              <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-[#101540]/10 hover:shadow-[0_20px_70px_rgba(16,21,64,0.3)] transition-all duration-500 hover:scale-[1.02]">
                {/* Mockup Header */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-gradient-to-r from-[#101540] to-[#1a2158] text-white text-sm rounded-lg font-medium shadow-lg shadow-[#101540]/20 hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                      Overview
                    </div>
                    <div className="px-4 py-2 text-gray-600 text-sm rounded-lg hover:bg-gradient-to-br hover:from-[#101540]/5 hover:to-transparent transition-all cursor-pointer hover:text-[#101540] hover:scale-105">
                      Analytics
                    </div>
                    <div className="px-4 py-2 text-gray-600 text-sm rounded-lg hover:bg-gradient-to-br hover:from-[#101540]/5 hover:to-transparent transition-all cursor-pointer hover:text-[#101540] hover:scale-105">
                      Reports
                    </div>
                  </div>
                </div>

                {/* Mockup Body */}
                <div className="p-6 space-y-4 bg-gradient-to-br from-white to-gray-50/50">
                  <div className="group relative p-5 rounded-xl bg-gradient-to-br from-[#101540]/5 via-white to-transparent border border-[#101540]/10 hover:border-[#101540]/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#101540]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <div className="relative">
                      <div className="text-sm text-gray-600 mb-2">Total Inventory Value</div>
                      <div className="text-3xl font-bold bg-gradient-to-br from-[#101540] to-[#1a2158] bg-clip-text text-transparent mb-2">
                        RS 2.4M
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-bounce-subtle">
                          <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm font-semibold">12.5%</span>
                        <span className="text-xs text-gray-500 ml-1">this month</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Orders Processed", value: "12,456", change: "28.3%" },
                      { label: "Stock Accuracy", value: "99.8%", badge: "Optimal" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="group relative p-4 rounded-xl bg-gradient-to-br from-[#101540]/5 via-white to-transparent border border-[#101540]/10 hover:border-[#101540]/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.05] cursor-pointer overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#101540]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                          <div className="text-xs text-gray-600 mb-1">{item.label}</div>
                          <div className="text-xl font-bold bg-gradient-to-br from-[#101540] to-[#1a2158] bg-clip-text text-transparent mb-1">
                            {item.value}
                          </div>
                          {item.change && (
                            <div className="flex items-center gap-1 text-green-600">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                  d="M6 10V2M2 6l4-4 4 4"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="text-xs font-semibold">{item.change}</span>
                            </div>
                          )}
                          {item.badge && (
                            <div className="inline-block px-2 py-1 bg-gradient-to-r from-[#101540] to-[#1a2158] text-white text-xs rounded-full shadow-lg shadow-[#101540]/20">
                              {item.badge}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -top-4 -right-4 p-3 bg-white rounded-xl shadow-2xl border border-[#101540]/10 flex items-center gap-2 animate-float hover:scale-110 transition-transform cursor-pointer group"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#101540]/10 to-[#101540]/5 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="#101540" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#101540]">Real-time Sync</span>
            </div>

            <div
              className="absolute -bottom-6 -left-6 p-3 bg-white rounded-xl shadow-2xl border border-[#101540]/10 flex items-center gap-2 animate-float hover:scale-110 transition-transform cursor-pointer group"
              style={{ animationDelay: "0.7s", animationDuration: "3.5s" }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:rotate-12 transition-transform">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#101540]">Automated Alerts</span>
            </div>

            <div
              className="absolute top-1/2 -right-8 p-2 bg-white rounded-lg shadow-xl border border-[#101540]/10 animate-float hover:scale-110 transition-transform cursor-pointer"
              style={{ animationDelay: "1s", animationDuration: "4s" }}
            >
              <div className="text-2xl">⚡</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-y border-[#101540]/10 bg-gradient-to-r from-[#101540]/5 via-transparent to-[#101540]/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-600 mb-8 animate-fade-in">
            Trusted by industry leaders worldwide
          </p>
          <div className="flex items-center justify-center gap-16 flex-wrap">
            {["ACME Corp", "TechFlow", "Innovate Inc", "NextGen", "GlobalTrade", "SmartStock"].map((logo, i) => (
              <div
                key={logo}
                className="text-lg font-bold text-[#101540]/40 hover:text-[#101540] transition-all duration-300 cursor-pointer hover:scale-110 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 md:px-8 lg:px-16 xl:px-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,21,64,0.03)_0%,transparent_50%)]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#101540]/5 via-[#101540]/10 to-[#101540]/5 border border-[#101540]/10 text-sm font-medium text-[#101540] animate-fade-in">
              Platform
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold text-balance animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="bg-gradient-to-br from-[#101540] via-[#1a2158] to-[#101540] bg-clip-text text-transparent">
                Faster iteration.
              </span>{" "}
              <span className="text-[#101540]">More innovation.</span>
            </h2>
            <p className="text-lg text-gray-600 text-pretty animate-fade-in" style={{ animationDelay: "0.2s" }}>
              The platform for rapid progress. Let your team focus on shipping features instead of managing
              infrastructure with automated workflows and intelligent insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                title: "Multi-warehouse Management",
                desc: "Manage inventory across unlimited locations with centralized control and real-time visibility.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3l7 7m0 0l7-7m-7 7v11m-7-7h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
                title: "Intelligent Forecasting",
                desc: "AI-powered demand prediction helps you optimize stock levels and reduce carrying costs.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                title: "Automated Workflows",
                desc: "Set up automatic reordering, stock alerts, and approval flows to eliminate manual tasks.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                title: "Enterprise Security",
                desc: "SOC 2 Type II certified with role-based access control and audit logs for compliance.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                title: "Advanced Analytics",
                desc: "Deep insights into inventory turnover, profitability, and operational efficiency metrics.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2" />
                    <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
                title: "Seamless Integration",
                desc: "Connect with Shopify, WooCommerce, QuickBooks, and 100+ other platforms via API.",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative p-8 rounded-2xl bg-white border border-[#101540]/10 hover:border-[#101540]/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#101540]/5 via-transparent to-[#101540]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#101540]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#101540]/10 to-[#101540]/5 flex items-center justify-center mb-6 text-[#101540] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-[#101540]/0 group-hover:shadow-[#101540]/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#101540] mb-3 group-hover:text-[#1a2158] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-pretty group-hover:text-gray-700 transition-colors">
                    {feature.desc}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[#101540] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-sm font-semibold">Learn more</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-8 lg:px-16 xl:px-24 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-[#101540] via-[#1a2158] to-[#101540] text-white overflow-hidden shadow-2xl hover:shadow-[0_20px_80px_rgba(16,21,64,0.4)] transition-all duration-500 group">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15)_0%,transparent_50%)] animate-pulse"
              style={{ animationDuration: "3s" }}
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1)_0%,transparent_40%)] animate-pulse"
              style={{ animationDuration: "4s", animationDelay: "1s" }}
            />

            {/* Floating particles */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-float" />
            <div
              className="absolute top-20 right-20 w-3 h-3 bg-white/20 rounded-full animate-float"
              style={{ animationDelay: "1s", animationDuration: "4s" }}
            />
            <div
              className="absolute bottom-16 left-1/4 w-2 h-2 bg-white/25 rounded-full animate-float"
              style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
            />

            <div className="relative space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance animate-fade-in">
                Transform your inventory operations today
              </h2>
              <p
                className="text-lg text-white/90 text-pretty max-w-2xl mx-auto animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                Join 10,000+ businesses already optimizing their inventory with intelligent automation.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#101540] rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 mt-4 group/btn animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                Start Your Free Trial
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="group-hover/btn:translate-x-1 transition-transform"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
              <p className="text-sm text-white/70 pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
