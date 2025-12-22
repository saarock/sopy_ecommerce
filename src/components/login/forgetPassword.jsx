import { useState } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../button/Button";
import userService from "../../services/userService";
import { toast } from "react-toastify";

export default function ForgotPasswordComponent({ setShowForgetPassword }) {
  const [loading, setLoading] = useState(false);
  const [mail, setMail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !mail ||
      mail.trim() === "" ||
      mail.includes(" ") ||
      !mail.includes("@")
    ) {
      toast.warn("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await userService.forgetPassword(mail);
      toast.success(response.message);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(16, 21, 64, 0.03) 0%, rgba(16, 21, 64, 0.08) 100%)",
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20 animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(16, 21, 64, 0.3) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 animate-float-delayed"
          style={{
            background:
              "radial-gradient(circle, rgba(16, 21, 64, 0.2) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Back to login link */}
        <a
          onClick={(e) => {
            e.preventDefault();
            setShowForgetPassword(false);
          }}
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:gap-3 transition-all duration-300 cursor-pointer"
          style={{ color: "#101540!important" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </a>

        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#7277a0] to-transparent opacity-70" />

          {/* Icon with gradient background */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[rgba(16,21,64,0.1)] to-[rgba(16,21,64,0.05)] animate-pulse-slow">
                <Mail className="w-8 h-8" style={{ color: "#101540" }} />
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-[rgba(16,21,64,0.1)] animate-ping-slow" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#101540] to-[rgba(16,21,64,0.7)] bg-clip-text text-transparent">
              Forgot Password?
            </h2>
            <p className="text-gray-600 text-sm">
              No worries! Enter your email and we'll send you reset
              instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold"
                style={{ color: "#101540" }}
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-[#101540] transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={mail}
                  placeholder="Enter your email"
                  onChange={(e) => {
                    setMail(e.target.value);
                  }}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#101540] focus:ring-4 focus:ring-[rgba(16,21,64,0.1)] transition-all duration-300 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, #101540 0%, rgba(16, 21, 64, 0.8) 100%)",
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {/* Button content */}
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Additional help text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgetPassword(false);
                }}
                className="font-semibold hover:underline transition-all duration-300 cursor-pointer"
                style={{ color: "#101540" }}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Help text below card */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a
              href="/support"
              className="font-semibold hover:underline"
              style={{ color: "#101540" }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
