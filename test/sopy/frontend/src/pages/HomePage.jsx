"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ShoppingBag, Shield, Truck, Star, Sparkles } from "lucide-react"
import api from "../lib/api"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await api.get("/products?featured=true&limit=8")
      setFeaturedProducts(data.data)
    } catch (error) {
      console.error("Error fetching featured products:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="glass-card max-w-4xl mx-auto p-12 backdrop-blur-xl bg-white/30 border-white/40 shadow-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/50 text-primary-700 font-semibold mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Premium Shopping Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600">
              Discover Luxury <br />
              <span className="text-primary-600">Without Limits</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Curated collections of premium products at unbeatable prices. Experience the future of shopping today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/products" className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:scale-105">
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/register" className="btn-secondary text-lg px-8 py-4 bg-white/80 backdrop-blur-sm hover:scale-105">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Truck,
              title: "Global Shipping",
              desc: "Free express delivery on all orders over $100",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: Shield,
              title: "Secure Payments",
              desc: "Bank-grade encryption for all transactions",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              icon: Star,
              title: "Premium Quality",
              desc: "Hand-picked products from top global brands",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((feature, idx) => (
            <div key={idx} className="glass-card hover:-translate-y-2 group">
              <div
                className={`flex items-center justify-center w-16 h-16 ${feature.bg} rounded-2xl mb-6 transition-transform group-hover:scale-110 duration-300`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-800">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900">Featured Collection</h2>
            <p className="text-zinc-500 text-lg">Handpicked essentials for the modern lifestyle</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center text-primary-600 font-semibold hover:text-primary-700">
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} className="group">
                <div className="glass-card p-4 h-full flex flex-col hover:shadow-primary-500/20">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-zinc-100">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                    )}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold px-4 py-2 border-2 border-white rounded-lg">Out of Stock</span>
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-semibold text-lg mb-1 text-zinc-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-zinc-900">${product.price.toFixed(2)}</span>
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium text-amber-700">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link to="/products" className="btn-outline w-full justify-center">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  )
}
