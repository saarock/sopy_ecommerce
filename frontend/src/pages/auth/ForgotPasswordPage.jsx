import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import axios from "axios"
import toast from "react-hot-toast"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            await axios.post("/api/auth/forgot-password", { email: data.email })
            setIsEmailSent(true)
            toast.success("Reset link sent to your email")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send reset link")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                        {isEmailSent ? "Check your email" : "Forgot Password?"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isEmailSent
                            ? "We have sent a password reset link to your email address."
                            : "Enter your email address and we'll send you a link to reset your password."}
                    </p>
                </div>

                {!isEmailSent ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Please enter a valid email",
                                    },
                                })}
                                className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.email ? "border-red-500" : "border-gray-300"
                                    } rounded-md text-sm shadow-sm placeholder-gray-400
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="mt-8">
                        <button
                            onClick={() => setIsEmailSent(false)}
                            className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Try another email
                        </button>
                    </div>

                )}

                <div className="flex justify-center">
                    <Link
                        to="/login"
                        className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
