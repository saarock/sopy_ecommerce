import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2, Eye, EyeOff } from "lucide-react"
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter"

export default function ResetPasswordPage() {
    const { token } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const passwordValue = watch("password")

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            await axios.put(`/api/auth/reset-password/${token}`, {
                password: data.password,
            })
            toast.success("Password reset successful")
            navigate("/login")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-600">Enter your new password below.</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    className={`block w-full px-3 py-2 pr-10 bg-white border ${errors.password ? "border-red-500" : "border-gray-300"
                                        } rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                            )}
                            <PasswordStrengthMeter password={passwordValue} />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (val) => {
                                            if (watch("password") !== val) {
                                                return "Your passwords do not match"
                                            }
                                        },
                                    })}
                                    className={`block w-full px-3 py-2 pr-10 bg-white border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                        } rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
