"use client"

import { useEffect, useState } from "react"
import api from "../../lib/api"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

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
  }, [])

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
      const res = await api.get("/admin/products")
      setProducts(res.data.data || [])
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
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    )
  }

  /* ---------------- UI ---------------- */
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageSrc(product.images?.[0])}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">${product.price.toFixed(2)}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-blue-600 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

              <input
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border px-4 py-2 rounded"
                required
              />

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
