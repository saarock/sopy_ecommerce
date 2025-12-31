"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../lib/api"
import { ArrowLeft, MapPin, Package, CreditCard, Clock, CheckCircle } from "lucide-react"

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/orders/${id}`)
      // handle if backend returns wrapped data { success: true, data: order }
      setOrder(res.data.data || res.data)
      setError("")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to fetch order")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <span className="font-semibold">Error:</span>
          {error || "Order not found"}
        </div>
        <Link to="/orders" className="btn-secondary mt-6 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/orders" className="text-zinc-500 hover:text-primary-600 mb-6 inline-flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      <div className="glass-card overflow-hidden p-0">
        {/* Header */}
        <div className="bg-zinc-50/50 p-6 sm:p-8 border-b border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-zinc-500 mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)} uppercase tracking-wide`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              Shipping Details
            </h2>
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 text-zinc-700 space-y-1">
              <p className="font-semibold text-zinc-900">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
              {order.shippingAddress?.phone && <p className="pt-2 text-sm text-zinc-500">Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" />
              Payment Summary
            </h2>
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 space-y-3">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>${Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span>${Number(order.shippingCost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Tax</span>
                <span>${Number(order.tax || 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between text-lg font-bold text-zinc-900">
                <span>Total</span>
                <span className="text-primary-600">${Number(order.totalAmount || order.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t border-zinc-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary-500" />
            Items
          </h2>
          <div className="space-y-4">
            {/* Handle both orders.items and orders.orderItems depending on backend consistency */}
            {(order.orderItems || order.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-xl hover:shadow-sm transition-shadow">
                <img
                  src={item.image || item.product?.images?.[0]?.url || "/placeholder.svg"}
                  alt={item.name || item.product?.name}
                  className="w-20 h-20 object-cover rounded-lg bg-zinc-100 border border-zinc-200"
                />
                <div className="flex-1">
                  <Link
                    to={`/products/${item.product?._id || item.product}`}
                    className="font-semibold text-lg text-zinc-900 hover:text-primary-600 transition-colors"
                  >
                    {item.name || item.product?.name}
                  </Link>
                  <p className="text-sm text-zinc-500 mt-1">
                    Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                  </p>
                </div>
                <p className="font-bold text-zinc-900 text-lg">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {order.paymentStatus === "paid" && (
          <div className="bg-green-50 border-t border-green-100 p-4 text-center">
            <p className="text-green-800 font-medium flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Payment Completed Successfully
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
