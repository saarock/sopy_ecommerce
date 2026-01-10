"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../lib/api"
import { ChevronLeft, ChevronRight, Package, ArrowRight, Clock, CheckCircle } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [page])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/orders?page=${page}&limit=5`)

      // backend returns: { success: true, data: [...], pagination: {...} }
      setOrders(res.data?.data || [])
      if (res.data?.pagination) {
        setTotalPages(res.data.pagination.pages)
      }

      setError("")
    } catch (err) {
      console.error("Fetch orders error:", err)
      setError(err.response?.data?.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8">My Orders</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {orders.length === 0 ? (
          <div className="glass-card text-center py-16">
            <Package className="mx-auto h-20 w-20 text-zinc-300 mb-4" />
            <h3 className="text-xl font-medium text-zinc-900 mb-2">No orders yet</h3>
            <p className="text-zinc-500 mb-8">Start shopping to create your first order!</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="glass-card p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                      <p className="text-sm text-zinc-500 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <div className="flex items-center gap-2 text-sm text-zinc-700">
                        <Clock className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)} uppercase tracking-wide`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t border-zinc-100 py-6">
                    <div className="space-y-4">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl bg-zinc-100 border border-zinc-200"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-zinc-900 text-lg mb-1">{item.name}</p>
                            <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-zinc-900 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 mt-4 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-zinc-500 mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-primary-600">${Number(order.totalPrice || 0).toFixed(2)}</p>
                    </div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn-outline w-full sm:w-auto justify-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-full bg-white shadow-md hover:bg-zinc-50 disabled:opacity-50 transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-zinc-700" />
                </button>
                <span className="font-medium text-zinc-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-full bg-white shadow-md hover:bg-zinc-50 disabled:opacity-50 transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-zinc-700" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
