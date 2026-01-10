"use client"

import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Search, Filter, ShoppingBag } from "lucide-react"
import api from "../lib/api"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"
import toast from "react-hot-toast"

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  })
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  const { addToCart } = useCartStore()
  const { user } = useAuthStore()

  const categories = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys", "Beauty", "Food", "Other"]

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  /* ---------------- IMAGE HANDLER ---------------- */
  const getImageSrc = (img) => {
    if (!img) return ""

    // if backend sends string directly
    if (typeof img === "string") {
      if (img.startsWith("data:image/")) return img
      if (img.startsWith("/9j") || img.startsWith("iVBOR")) {
        return `data:image/jpeg;base64,${img}`
      }
      if (img === "data:image/jpeg;base64") return "" // invalid
      return img
    }

    // if backend sends { url, alt }
    const url = img.url
    if (!url) return ""
    if (url.startsWith("data:image/")) return url
    if (url.startsWith("/9j") || url.startsWith("iVBOR")) {
      return `data:image/jpeg;base64,${url}`
    }
    if (url === "data:image/jpeg;base64") return "" // invalid
    return url
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      // IMPORTANT: build from searchParams directly (so URL is the source of truth)
      const search = searchParams.get("search") || ""
      const category = searchParams.get("category") || ""
      const sort = searchParams.get("sort") || "newest"
      const minPrice = searchParams.get("minPrice") || ""
      const maxPrice = searchParams.get("maxPrice") || ""
      const page = searchParams.get("page") || "1"

      if (search) params.append("search", search)
      if (category) params.append("category", category)
      if (sort) params.append("sort", sort)
      if (minPrice) params.append("minPrice", minPrice)
      if (maxPrice) params.append("maxPrice", maxPrice)
      params.append("page", page)

      const res = await api.get(`/products?${params.toString()}`)

      // backend: { success, data: [...], pagination }
      setProducts(res.data?.data || [])
      setPagination(res.data?.pagination || { page: 1, pages: 1, total: 0 })

      // keep local filters in sync with URL (optional but nice)
      setFilters({ search, category, sort, minPrice, maxPrice })
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    const params = new URLSearchParams(searchParams)

    // reset page when filters change
    params.delete("page")

    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })

    setSearchParams(params)
  }

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error("Please login to add items to cart")
      return
    }
    try {
      await addToCart(productId, 1)
    } catch (error) {
      // handled in store
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Shop All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card sticky top-20">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select className="input" value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select className="input" value={filters.sort} onChange={(e) => handleFilterChange("sort", e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="input"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                />
                <input
                  type="number"
                  className="input"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => {
                setFilters({ search: "", category: "", sort: "newest", minPrice: "", maxPrice: "" })
                setSearchParams({})
              }}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {products.length} of {pagination.total} products
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => {
                  const imgSrc = getImageSrc(product.images?.[0])
                  return (
                    <div key={product._id} className="card hover:shadow-lg transition-shadow">
                      <Link to={`/products/${product._id}`}>
                        <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                          {imgSrc ? (
                            <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </Link>

                      <Link to={`/products/${product._id}`}>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-600">{product.name}</h3>
                      </Link>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary-600">${Number(product.price || 0).toFixed(2)}</span>
                        {product.rating > 0 && (
                          <span className="text-sm text-gray-600">
                            ⭐ {Number(product.rating || 0).toFixed(1)} ({product.numReviews || 0})
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock === 0}
                        className={`w-full ${product.stock === 0 ? "btn-secondary cursor-not-allowed" : "btn-primary"}`}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams)
                        params.set("page", page.toString())
                        setSearchParams(params)
                      }}
                      className={`px-4 py-2 rounded-lg ${
                        page === pagination.page ? "bg-primary-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
