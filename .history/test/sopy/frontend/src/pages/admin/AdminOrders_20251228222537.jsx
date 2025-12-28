"use client"

import { useState, useEffect } from "react"
import api from "../../lib/api"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  // handle image string (raw base64 OR data-url OR normal url)
  const getImageSrc = (img) => {
    if (!img) return "/placeholder.svg"
    if (img.startsWith("data:image/")) return img
    if (img.startsWith("/9j") || img.startsWith("iVBOR")) {
      return `data:image/jpeg;base64,${img}`
    }
    // if backend mistakenly sends only "data:image/jpeg;base64" without the payload
    if (img === "data:image/jpeg;base64") return "/placeholder.svg"
    return img
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get("/admin/orders")

      // backend returns: { success, data: [...], pagination }
      setOrders(res.data?.data || [])
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus })
      await fetchOrders()
      setSelectedOrder(null)
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update order")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 text-sm text-gray-900">#{order._id?.slice(-8)}</td>

                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{order.user?.name || "—"}</div>
                    <div className="text-sm text-gray-500">{order.user?.email || "—"}</div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                </td>

                {/* backend uses totalPrice */}
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${Number(order.totalPrice || 0).toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:text-blue-700">
                    View Details
                  </button>
                </td>
              </tr>
            ))}

            {orders?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order #{selectedOrder._id?.slice(-8)}
            </h2>

            <div className="space-y-6">
              {/* Customer */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                <p className="text-gray-700">{selectedOrder.user?.name || "—"}</p>
                <p className="text-gray-600">{selectedOrder.user?.email || "—"}</p>
              </div>

              {/* Shipping address (backend shape) */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-gray-700">{selectedOrder.shippingAddress?.street || "—"}</p>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress?.city || "—"}, {selectedOrder.shippingAddress?.state || "—"}{" "}
                  {selectedOrder.shippingAddress?.zipCode || ""}
                </p>
                <p className="text-gray-700">{selectedOrder.shippingAddress?.country || "—"}</p>
              </div>

              {/* Items (backend: orderItems) */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>

                <div className="space-y-3">
                  {(selectedOrder.orderItems || []).map((item) => (
                    <div key={item._id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageSrc(item.image)}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover border"
                        />
                        <div>
                          <div className="text-gray-900 font-medium">{item.name}</div>
                          <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                        </div>
                      </div>

                      <div className="text-gray-900 font-medium">
                        ${Number(item.price || 0).toFixed(2)} × {item.quantity} = $
                        {Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals (backend fields) */}
              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between text-gray-700">
                  <span>Items</span>
                  <span>${Number(selectedOrder.itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${Number(selectedOrder.taxPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>${Number(selectedOrder.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span>${Number(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Update status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Update Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
