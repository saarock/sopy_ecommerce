"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { Loader2, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const { login, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData)
      navigate("/")
    } catch (error) {
      // Error is handled in the store
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 pt-24">
      <div className="max-w-md w-full">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-emerald-600 mb-2">Welcome Back</h2>
            <p className="text-zinc-500">Sign in to continue your premium shopping experience.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="input focus:ring-primary-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                className="input focus:ring-primary-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary flex items-center justify-center gap-2 ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-700 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
