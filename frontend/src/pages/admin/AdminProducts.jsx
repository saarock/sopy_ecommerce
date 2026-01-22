"use client"

import { useEffect, useState } from "react"
import api from "../../lib/api"
import { ChevronLeft, ChevronRight, Plus, Search, Edit2, Trash2, Package } from "lucide-react"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // form uses strings
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [""],
  })

  useEffect(() => {
    fetchProducts()
  }, [page])

  /* ---------------- IMAGE HANDLER ---------------- */
  const getImageSrc = (img) => {
    if (!img) return "/placeholder.svg"

    // string image
    if (typeof img === "string") {
      if (img.startsWith("data:image/")) return img
      if (img.startsWith("/9j") || img.startsWith("iVBOR")) {
        return `data:image/jpeg;base64,${img}`
      }
      return img
    }

    // object image { url, alt }
    if (img.url) {
      if (img.url.startsWith("data:image/")) return img.url
      if (img.url.startsWith("/9j") || img.url.startsWith("iVBOR")) {
        return `data:image/jpeg;base64,${img.url}`
      }
      return img.url
    }

    return "/placeholder.svg"
  }

  /* ---------------- FETCH ---------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/admin/products?page=${page}&limit=10`)
      setProducts(res.data.data || [])
      if (res.data?.pagination) {
        setTotalPages(res.data.pagination.pages)
      }
    } catch (err) {
      console.error("Fetch failed:", err)
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        images: formData.images
          .map((img) => img.trim())
          .filter(Boolean)
          .map((url) => ({
            url,
            alt: formData.name,
          })),
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload)
      } else {
        await api.post("/products", payload)
      }

      setShowModal(false)
      resetForm()
      fetchProducts()
    } catch (err) {
      alert(err?.response?.data?.message || "Save failed")
    }
  }

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return
    try {
      await api.delete(`/products/${id}`)
      fetchProducts()
    } catch (err) {
      alert("Delete failed")
    }
  }

  /* ---------------- HELPERS ---------------- */
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      images: [""],
    })
    setEditingProduct(null)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)

    const imageUrls =
      product.images?.map((img) =>
        typeof img === "string" ? img : img.url
      ) || []

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: imageUrls.length ? imageUrls : [""],
    })

    setShowModal(true)
  }

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900">Products Management</h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="glass-card overflow-hidden p-0 border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-zinc-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          src={getImageSrc(product.images?.[0])}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover bg-zinc-100"
                        />
                      </div>
                      <div className="font-medium text-zinc-900">{product.name}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-zinc-600">
                    <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md text-xs font-medium">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-zinc-900">
                    Rs. {product.price.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${product.stock > 10
                        ? "bg-green-100 text-green-800 border-green-200"
                        : product.stock > 0
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-red-100 text-red-800 border-red-200"
                        }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-zinc-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
                    <p className="text-lg font-medium text-zinc-900">No products found</p>
                    <p className="text-sm">Get started by creating a new product</p>
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border px-4 py-2 rounded"
                required
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border px-4 py-2 rounded"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="border px-4 py-2 rounded"
                  required
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="border px-4 py-2 rounded"
                  required
                />
              </div>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border px-4 py-2 rounded"
                required
              >
                <option value="">Select Category</option>
                {[
                  "Electronics",
                  "Clothing",
                  "Books",
                  "Home & Garden",
                  "Sports",
                  "Toys",
                  "Beauty",
                  "Food",
                  "Other",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                placeholder="Image URLs (comma separated)"
                value={formData.images.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    images: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full border px-4 py-2 rounded"
                required
              />

              <div className="flex gap-2 flex-wrap">
                {formData.images.filter(Boolean).map((img, i) => (
                  <img
                    key={i}
                    src={getImageSrc(img)}
                    className="w-16 h-16 rounded border object-cover"
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded">
                  {editingProduct ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-200 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
