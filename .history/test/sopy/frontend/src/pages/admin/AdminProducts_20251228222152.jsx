"use client"

import { useEffect, useState } from "react"
import api from "../../lib/api"

type ProductImage =
  | string
  | {
      url?: string
      alt?: string
      _id?: string
    }

type Product = {
  _id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: ProductImage[]
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // form expects string[] because the input is a comma-separated list of URLs/base64
  const [formData, setFormData] = useState<{
    name: string
    description: string
    price: string
    category: string
    stock: string
    images: string[]
  }>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [""],
  })

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Converts image (string OR {url}) into a valid <img src="..."> value.
   * Supports:
   * - http(s) urls
   * - already-prefixed data urls: data:image/...;base64,...
   * - raw base64 strings (e.g. "/9j/..." or "iVBOR...") by adding the proper prefix
   */
  const getImageSrc = (img?: ProductImage) => {
    if (!img) return "/placeholder.svg"

    // backend might send string already
    if (typeof img === "string") {
      if (!img) return "/placeholder.svg"
      if (img.startsWith("data:image/")) return img

      // raw base64 signatures: JPEG often starts with /9j, PNG often starts with iVBOR
      if (img.startsWith("/9j") || img.startsWith("iVBOR")) {
        return `data:image/jpeg;base64,${img}`
      }

      return img
    }

    // backend sends object: { url, alt }
    const url = img.url
    if (!url) return "/placeholder.svg"

    if (url.startsWith("data:image/")) return url

    if (url.startsWith("/9j") || url.startsWith("iVBOR")) {
      return `data:image/jpeg;base64,${url}`
    }

    return url
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get("/admin/products")
      // your backend shape: { success, data: [...], pagination }
      setProducts(res.data.data || [])
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  // Convert form images (string[]) -> backend images format
  // If your backend wants objects: [{url, alt}]
  const toBackendImages = (imgs: string[], nameForAlt: string) => {
    const cleaned = imgs.map((s) => s.trim()).filter(Boolean)
    return cleaned.map((url) => ({
      url,
      alt: nameForAlt || "product image",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // convert strings -> numbers
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        images: toBackendImages(formData.images, formData.name),
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload)
      } else {
        await api.post("/products", payload)
      }

      setShowModal(false)
      resetForm()
      fetchProducts()
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save product")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await api.delete(`/products/${id}`)
      fetchProducts()
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete product")
    }
  }

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

  const openEditModal = (product: Product) => {
    setEditingProduct(product)

    // Convert backend images (object/string) -> string urls for input field
    const imageUrls = (product.images || [])
      .map((img) => {
        if (typeof img === "string") return img
        return img.url || ""
      })
      .filter(Boolean)

    setFormData({
      name: product.name ?? "",
      description: product.description ?? "",
      price: String(product.price ?? ""),
      category: product.category ?? "",
      stock: String(product.stock ?? ""),
      images: imageUrls.length ? imageUrls : [""],
    })

    setShowModal(true)
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>

        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageSrc(product.images?.[0])}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />

                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{product.name}</span>

                      {/* Optional: show small thumbnails of more images */}
                      {product.images?.length > 1 && (
                        <div className="flex gap-1 mt-1">
                          {product.images.slice(1, 4).map((img, idx) => (
                            <img
                              key={idx}
                              src={getImageSrc(img)}
                              alt={product.name}
                              className="w-6 h-6 object-cover rounded"
                            />
                          ))}
                          {product.images.length > 4 && <span className="text-xs text-gray-500 ml-1">+more</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-700">{product.category}</td>

                <td className="px-6 py-4 text-gray-900 font-medium">
                  ${Number(product.price || 0).toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-700 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (comma-separated for multiple)
                </label>
                <input
                  type="text"
                  value={formData.images.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://... , data:image/jpeg;base64,... , /9j/...(raw base64)"
                  required
                />

                {/* Optional preview */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {formData.images
                    .filter(Boolean)
                    .slice(0, 6)
                    .map((img, idx) => (
                      <img
                        key={idx}
                        src={getImageSrc(img)}
                        alt="preview"
                        className="w-14 h-14 object-cover rounded border"
                      />
                    ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  {editingProduct ? "Update" : "Create"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
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
