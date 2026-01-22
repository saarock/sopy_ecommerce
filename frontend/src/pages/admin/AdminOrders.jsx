"use client"

import { useState, useEffect } from "react"
import api from "../../lib/api"
import BillGenerator from "../../components/BillGenerator"
import { Printer, ChevronLeft, ChevronRight, Search, Eye, Edit, Truck, X, Users, Package } from "lucide-react"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination State
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pagination, setPagination] = useState(null)

  // Invoice State
  const [showInvoice, setShowInvoice] = useState(false)
  const [invoiceOrder, setInvoiceOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [page])

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

  const fetchOrders = async (currPage = page, searchTerm = searchQuery) => {
    try {
      console.log("Fetching orders:", { currPage, searchTerm })
      setLoading(true)

      const res = await api.get("/admin/orders", {
        params: {
          page: currPage,
          limit: 10,
          search: searchTerm,
        },
      })

      // backend returns: { success, data: [...], pagination }
      setOrders(res.data?.data || [])
      if (res.data?.pagination) {
        setPagination(res.data.pagination)
        setTotalPages(res.data.pagination.pages)
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  // ... (existing code for handleStatusUpdate, etc.)

  // NOTE: Need to scroll down to find the render part for input
  // Since replace_file_content works on line ranges, I'll split this if needed or verify indices.
  // The start line 12 covers the state, the fetchOrders is around 39. The input is around 125.
  // The tool works on contiguous blocks. I need to be careful.
  // I will just replace the top section first.


  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus })
      await fetchOrders()
      // Update selected order locally to reflect change immediately
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update order")
    }
  }

  const handlePrintInvoice = (order) => {
    setInvoiceOrder(order)
    setShowInvoice(true)
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

  if (showInvoice && invoiceOrder) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-auto p-4">
        <div className="max-w-4xl mx-auto print:w-full">
          <div className="flex justify-end mb-4 print:hidden">
            <button
              onClick={() => setShowInvoice(false)}
              className="btn-secondary flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Close Preview
            </button>
          </div>
          <BillGenerator order={invoiceOrder} />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900">Orders Management</h1>
        <div className="flex gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setPage(1)
              fetchOrders(1, searchQuery)
            }}
            className="flex gap-2"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm w-64"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button type="submit" className="btn-primary px-4 py-2 text-sm">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="glass-card overflow-hidden p-0 border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-zinc-200">
              {orders?.map((order) => (
                <tr key={order._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    #{order._id?.slice(-8).toUpperCase()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {order.user?.name?.charAt(0) || "U"}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-zinc-900">{order.user?.name || "Unknown"}</div>
                        <div className="text-xs text-zinc-500">{order.user?.email || ""}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-zinc-900">
                    ${Number(order.totalPrice || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handlePrintInvoice(order)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {orders?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
                    <p className="text-lg font-medium text-zinc-900">No orders found</p>
                    <p className="text-sm">New orders will appear here</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-200 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">
                  Order Details
                </h2>
                <p className="text-sm text-zinc-500">ID: #{selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-zinc-500" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Status Bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${selectedOrder.status === 'delivered' ? 'bg-green-500' :
                    selectedOrder.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></span>
                  <span className="font-medium text-zinc-700 capitalize">Current Status: {selectedOrder.status}</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                    className="input py-1.5 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div>
                  <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-500" /> Customer Info
                  </h3>
                  <div className="bg-white border boundary-zinc-200 rounded-xl p-4 space-y-2">
                    <p className="text-zinc-600"><span className="font-medium text-zinc-900">Name:</span> {selectedOrder.user?.name || "—"}</p>
                    <p className="text-zinc-600"><span className="font-medium text-zinc-900">Email:</span> {selectedOrder.user?.email || "—"}</p>
                  </div>
                </div>

                {/* Shipping Info */}
                <div>
                  <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary-500" /> Shipping Details
                  </h3>
                  <div className="bg-white border boundary-zinc-200 rounded-xl p-4 space-y-2">
                    <p className="text-zinc-600">{selectedOrder.shippingAddress?.street}</p>
                    <p className="text-zinc-600">
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                    </p>
                    <p className="text-zinc-600">{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary-500" /> Order Items
                </h3>
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border-b last:border-0 border-zinc-100">
                      <img
                        src={getImageSrc(item.image)}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-zinc-100"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-zinc-900">{item.name}</h4>
                        <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-zinc-900">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-zinc-500">Rs. {item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex justify-end">
                <div className="w-full sm:w-72 bg-zinc-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span>Rs. {Number(selectedOrder.itemsPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Tax</span>
                    <span>${Number(selectedOrder.taxPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping</span>
                    <span>${Number(selectedOrder.shippingPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-zinc-200 flex justify-between font-bold text-lg text-zinc-900">
                    <span>Total</span>
                    <span>${Number(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setInvoiceOrder(selectedOrder)
                  setShowInvoice(true)
                }}
                className="btn-secondary flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-primary"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
