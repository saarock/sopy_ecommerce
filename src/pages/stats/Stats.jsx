"use client"

import { ChevronLeft, ChevronRight, TrendingUp, IndianRupee, Clock, XCircle, CheckCircle } from "lucide-react"
import productService from "../../services/productService"
import useUser from "../../hooks/useUser"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

import { useState, useEffect } from "react"


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Stats = () => {
  const { user } = useUser()
  const [stats, setStats] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchPurchaseStats = async (page = 1) => {
    try {
      setLoading(true)
      const data = await productService.getPurchaseStats(user._id, page, 6)
      setStats(data)
    } catch (error) {
      toast.error("Error fetching purchase stats")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchPurchaseStats(currentPage)
    } else {
      toast.error("User ID is not found, refresh and try again")
    }
  }, [user, currentPage])

  if (!stats && loading) {
    return <LoadingSpinner />
  }

  if (!stats) return null

  const purchaseDates = stats.purchases || []
  const purchaseCounts = purchaseDates.reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(purchaseCounts),
    datasets: [
      {
        label: "Daily Bookings",
        data: Object.values(purchaseCounts),
        fill: true,
        backgroundColor: "rgba(16, 21, 64, 0.05)",
        borderColor: "#101540",
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: "#101540",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  }

  const statCards = [
    {
      label: "Total Expenditure",
      value: `RS ${stats.totalSpent?.toLocaleString() || 0}`,
      icon: <IndianRupee className="w-6 h-6 text-white" />,
      color: "from-blue-600 to-indigo-700",
      sub: "Completed purchases",
    },
    {
      label: "Active Bookings",
      value: stats.pendingCount || 0,
      icon: <Clock className="w-6 h-6 text-white" />,
      color: "from-amber-500 to-orange-600",
      sub: "Awaiting fulfillment",
    },
    {
      label: "Successful Orders",
      value: stats.completedCount || 0,
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      color: "from-emerald-600 to-teal-700",
      sub: "Delivered & verified",
    },
    {
      label: "Cancelled",
      value: stats.cancelledCount || 0,
      icon: <XCircle className="w-6 h-6 text-white" />,
      color: "from-rose-600 to-red-700",
      sub: "Revoked or rejected",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#101540] tracking-tight">Your Portfolio</h1>
            <p className="text-gray-500 font-medium">Advanced analytics and booking history for your account.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#101540]">Real-time Sync</span>
          </div>
        </div>

        {/* Dynamic Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <div key={idx} className="group relative bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:-translate-y-1 overflow-hidden">
              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
                  <h3 className="text-2xl font-black text-[#101540]">{card.value}</h3>
                  <p className="text-xs font-bold text-gray-400 mt-1">{card.sub}</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 md:p-12 overflow-hidden">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-[#101540]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#101540]">Active Trends</h2>
              <p className="text-sm font-medium text-gray-400">Visualization of your daily booking activity</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: "#f1f5f9" }, ticks: { font: { weight: "600" } } },
                  x: { grid: { display: false }, ticks: { font: { weight: "600" } } },
                },
              }}
            />
          </div>
        </div>

        {/* History Table */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#101540] flex items-center gap-3">
              Detailed History
              <span className="px-3 py-1 bg-[#101540] text-white text-[10px] rounded-full uppercase tracking-tighter">
                {stats.history?.totalItems || 0} Total
              </span>
            </h2>
          </div>

          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Info</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.history?.data.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100">
                            {item.product?.imageUrl ? (
                              <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#101540] leading-none mb-1">{item.product?.name || "Deleted Item"}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{item.product?.category || "General"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-gray-400">{new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-sm font-black text-[#101540] bg-gray-50 px-3 py-1 rounded-lg">x{item.totalItems}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                          item.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-sm font-black text-[#101540]">RS {item.price.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-gray-400">{item.payment_gateway}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!stats.history?.data || stats.history.data.length === 0) && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No transaction history found</p>
                </div>
              )}
            </div>

            {/* Pagination Standardized */}
            {stats.history?.totalPages > 1 && (
              <div className="bg-gray-50/50 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Page <span className="text-[#101540]">{currentPage}</span> of <span className="text-[#101540]">{stats.history.totalPages}</span>
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-[#101540] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#101540] hover:text-white disabled:opacity-30 transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(stats.history.totalPages, p + 1))}
                    disabled={currentPage === stats.history.totalPages || loading}
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-[#101540] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#101540] hover:text-white disabled:opacity-30 transition-all duration-300"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
