"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ShoppingCart, Star, Package, ArrowLeft } from "lucide-react"
import api from "../lib/api"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"
import toast from "react-hot-toast"

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [review, setReview] = useState({ rating: 5, comment: "" })
  const [submittingReview, setSubmittingReview] = useState(false)

  const { addToCart } = useCartStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // ✅ Converts raw base64 to a valid image src
  const getImageSrc = (img) => {
    if (!img) return ""

    // if string
    if (typeof img === "string") {
      if (img.startsWith("data:image/")) return img
      if (img.startsWith("/9j") || img.startsWith("iVBOR")) return `data:image/jpeg;base64,${img}`
      if (img === "data:image/jpeg;base64") return ""
      return img
    }

    // if object { url, alt }
    const url = img.url
    if (!url) return ""
    if (url.startsWith("data:image/")) return url
    if (url.startsWith("/9j") || url.startsWith("iVBOR")) return `data:image/jpeg;base64,${url}`
    if (url === "data:image/jpeg;base64") return ""
    return url
  }

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/products/${id}`)
      setProduct(res.data?.data || null)
      setSelectedImage(0)
      setQuantity(1)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Product not found")
      navigate("/products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart")
      navigate("/login")
      return
    }
    try {
      await addToCart(product._id, quantity)
      toast.success("Added to cart")
    } catch (error) {
      // handled in store
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please login to submit a review")
      return
    }

    setSubmittingReview(true)
    try {
      await api.post(`/products/${id}/reviews`, review)
      toast.success("Review submitted successfully")
      setReview({ rating: 5, comment: "" })
      fetchProduct()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review")
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) return null

  const mainImgSrc = getImageSrc(product.images?.[selectedImage])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
            {mainImgSrc ? (
              <img src={mainImgSrc} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => {
                const thumbSrc = getImageSrc(image)
                return (
                  <button
                    key={image._id || index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-200 rounded-lg overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-primary-600" : ""
                    }`}
                  >
                    {thumbSrc ? (
                      <img
                        src={thumbSrc}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full">
              {product.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {Number(product.rating || 0).toFixed(1)} ({product.numReviews || 0} reviews)
              </span>
            </div>
          )}

          <div className="mb-6">
            <span className="text-4xl font-bold text-primary-600">${Number(product.price || 0).toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="ml-3 text-xl text-gray-500 line-through">
                ${Number(product.compareAtPrice || 0).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          {product.brand && (
            <div className="mb-4">
              <span className="text-sm text-gray-600">Brand: </span>
              <span className="font-medium">{product.brand}</span>
            </div>
          )}

          <div className="mb-6">
            <span className="text-sm text-gray-600">Stock: </span>
            <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 ${
              product.stock === 0 ? "btn-secondary cursor-not-allowed" : "btn-primary"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {/* Write Review */}
        {user && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReview({ ...review, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star className={`w-8 h-8 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  rows={4}
                  className="input"
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>

              <button type="submit" disabled={submittingReview} className="btn-primary">
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {product.reviews?.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          ) : (
            product.reviews?.map((r) => (
              <div key={r._id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < r.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
