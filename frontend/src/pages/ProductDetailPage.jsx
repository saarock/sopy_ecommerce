"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ShoppingCart, Star, Package, ArrowLeft, Truck, ShieldCheck } from "lucide-react"
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) return null

  const mainImgSrc = getImageSrc(product.images?.[selectedImage])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-zinc-500 hover:text-primary-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Products
      </button>

      <div className="glass-card overflow-hidden p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Product Images - Left Side */}
          <div className="p-8 bg-zinc-50/50 border-r border-zinc-100">
            <div className="aspect-square bg-white rounded-2xl mb-4 overflow-hidden shadow-sm border border-zinc-100 relative group">
              {mainImgSrc ? (
                <img src={mainImgSrc} alt={product.name} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-zinc-200" />
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => {
                  const thumbSrc = getImageSrc(image)
                  return (
                    <button
                      key={image._id || index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-white rounded-xl overflow-hidden border transition-all ${selectedImage === index ? "border-primary-500 ring-2 ring-primary-200" : "border-zinc-200 hover:border-primary-300"
                        }`}
                    >
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-zinc-200" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Product Info - Right Side */}
          <div className="p-8 lg:p-12">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary-50 text-primary-700 border border-primary-100">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 leading-tight">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < product.rating ? "text-yellow-400 fill-current" : "text-zinc-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-zinc-500 text-sm font-medium">
                    ({product.numReviews} reviews)
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium"><Package className="w-4 h-4" /> In Stock</span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 font-medium"><Package className="w-4 h-4" /> Out of Stock</span>
                )}
              </div>
            </div>

            <div className="mb-8 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary-600">Rs. {Number(product.price || 0).toFixed(2)}</span>
                {product.compareAtPrice > product.price && (
                  <span className="text-xl text-zinc-400 line-through">
                    Rs. {Number(product.compareAtPrice || 0).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-zinc-600 mb-8 leading-relaxed text-lg">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50">
                <Truck className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium text-zinc-700">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50">
                <ShieldCheck className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium text-zinc-700">2 Year Warranty</span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-zinc-900">Quantity:</span>
                  <div className="flex items-center rounded-lg border border-zinc-200 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 text-zinc-500 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium text-zinc-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 text-zinc-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full btn-primary h-14 text-lg shadow-xl shadow-primary-500/20"
                >
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900">Customer Reviews</h2>
          <p className="text-zinc-500 mb-6">Share your thoughts with other customers</p>

          {/* Write Review */}
          {user ? (
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-700">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReview({ ...review, rating: star })}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`w-8 h-8 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-zinc-200"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-700">Comment</label>
                  <textarea
                    rows={4}
                    className="input w-full resize-none"
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    placeholder="Tell us what you like or dislike..."
                    required
                  />
                </div>

                <button type="submit" disabled={submittingReview} className="btn-primary w-full">
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-card p-6 text-center">
              <p className="text-zinc-600 mb-4">Please login to write a review.</p>
              <button onClick={() => navigate("/login")} className="btn-secondary w-full">Login</button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {product.reviews?.length === 0 ? (
            <div className="glass-card p-8 text-center text-zinc-500">
              <Star className="w-12 h-12 mx-auto text-zinc-200 mb-2" />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            product.reviews?.map((r) => (
              <div key={r._id} className="glass-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">{r.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < r.rating ? "text-yellow-400 fill-current" : "text-zinc-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 font-medium bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-zinc-600 leading-relaxed pl-13">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
