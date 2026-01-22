"use client"

import { useState, useEffect } from "react"
import api from "../../lib/api"
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/admin/analytics/dashboard")
      setStats(data.data)
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-zinc-900">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.overview?.totalRevenue || "0.00"}`}
          icon={DollarSign}
          color="bg-emerald-500"
          trend="+12.5%"
        />
        <StatsCard
          title="Total Orders"
          value={stats?.overview?.totalOrders || 0}
          icon={ShoppingCart}
          color="bg-blue-500"
          trend="+5.2%"
        />
        <StatsCard
          title="Total Products"
          value={stats?.overview?.totalProducts || 0}
          icon={Package}
          color="bg-purple-500"
        />
        <StatsCard
          title="Total Users"
          value={stats?.overview?.totalUsers || 0}
          icon={Users}
          color="bg-orange-500"
          trend="+8.1%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" /> Top Selling Products
            </h2>
          </div>
          {stats?.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-3 hover:bg-zinc-50 rounded-xl transition-colors">
                  <span className="flex items-center justify-center w-8 h-8 font-bold text-zinc-400 bg-zinc-100 rounded-lg">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 truncate">{product.name}</p>
                    <p className="text-sm text-zinc-500">{product.totalSold} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zinc-900">Rs. {product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-zinc-500">No sales data available</p>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Low Stock Alert
            </h2>
          </div>
          {stats?.lowStockProducts?.length > 0 ? (
            <div className="space-y-4">
              {stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-xl">
                  <span className="font-medium text-zinc-900">{product.name}</span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-lg">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-3">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-zinc-500">All products are well stocked!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="glass-card relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${color}`}></div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</h3>
          {trend && <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
            <TrendingUp className="w-3 h-3" /> {trend}
          </p>}
        </div>
        <div className={`p-4 rounded-2xl text-white shadow-xl transform group-hover:rotate-12 transition-transform duration-300 ${color} shadow-${color.replace('bg-', '')}/30`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  )
}
