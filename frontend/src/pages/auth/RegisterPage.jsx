"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { toast } from "react-toastify"
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter" // Note: Check consistency with react-hot-toast if that's what we switched to, but authStore uses one. 
// Actually current codebase uses react-hot-toast in store but RegisterPage imports react-toastify. 
// I should use toast from react-hot-toast to be consistent if that is the main one.
// Let's stick to consistent UI. 
import { Loader2, ArrowRight } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  })
  const { register, loading, user, sendOtp, otpSent, setOtpSent } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    setOtpSent(false)
  }, [setOtpSent])

  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email first")
      return
    }
    try {
      await sendOtp(formData.email)
    } catch (error) {
      // Error handled in store
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (!otpSent) {
      alert("Please send and verify OTP first")
      return
    }

    if (!formData.otp) {
      alert("Please enter the OTP sent to your email")
      return
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp,
      })
      navigate("/")
    } catch (error) {
      // Error handled in store
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 pt-24">
      <div className="max-w-md w-full">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-emerald-600 mb-2">Create Account</h2>
            <p className="text-zinc-500">Join Sopy today for exclusive deals and premium products.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="input focus:ring-primary-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  required
                  className="input focus:ring-primary-500 flex-1"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  disabled={loading || otpSent}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || otpSent || !formData.email}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${otpSent
                    ? "bg-emerald-100 text-emerald-700 cursor-default"
                    : "bg-primary-600 text-white hover:bg-primary-700 shadow-sm disabled:opacity-50"
                    }`}
                >
                  {otpSent ? "Sent" : "Send OTP"}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-zinc-700 mb-2">
                  Verification Code (OTP)
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  className="input focus:ring-primary-500 text-center text-2xl tracking-[1em] font-bold"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  placeholder="000000"
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-zinc-500 text-center">
                  Enter the 6-digit code sent to your email.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  className="input focus:ring-primary-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <PasswordStrengthMeter password={formData.password} />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-2">
                  Confirm
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className="input focus:ring-primary-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>
            <p className="text-xs text-zinc-500">Password must be at least 6 characters long.</p>

            <button
              type="submit"
              disabled={loading || !otpSent}
              className={`w-full btn-primary flex items-center justify-center gap-2 mt-4 ${loading || !otpSent ? "opacity-80 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold hover:underline">
              Sign in
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
