import express from "express"
import { validationResult } from "express-validator"
import { asyncHandler } from "../middleware/error.middleware.js"
import { protect } from "../middleware/auth.middleware.js"
import { registerValidator, loginValidator } from "../utils/validators.js"
import User from "../models/user.model.js"
import OTP from "../models/otp.model.js"
import { generateTokenAndSetCookie, clearCookie } from "../utils/jwt.utils.js"
import { sendOTPEmail, generateOTP } from "../utils/otp.utils.js"

const router = express.Router()

// @route   POST /api/auth/send-otp
// @desc    Send OTP for registration
// @access  Public
router.post(
  "/send-otp",
  asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
      const error = new Error("Please provide an email")
      error.statusCode = 400
      throw error
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      const error = new Error("User already exists with this email")
      error.statusCode = 400
      throw error
    }

    // Generate OTP
    const otpCode = generateOTP()

    // Save OTP to database
    await OTP.findOneAndUpdate({ email }, { otp: otpCode }, { upsert: true, new: true })

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otpCode)

    if (!emailSent) {
      const error = new Error("Failed to send OTP email")
      error.statusCode = 500
      throw error
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    })
  }),
)

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  registerValidator,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg)
      error.statusCode = 400
      throw error
    }

    const { name, email, password, otp } = req.body

    if (!otp) {
      const error = new Error("Please provide OTP")
      error.statusCode = 400
      throw error
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp })
    if (!otpRecord) {
      const error = new Error("Invalid or expired OTP")
      error.statusCode = 400
      throw error
    }

    // Check if user already exists (double check)
    const userExists = await User.findOne({ email })
    if (userExists) {
      const error = new Error("User already exists with this email")
      error.statusCode = 400
      throw error
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Delete OTP record after successful registration
    await OTP.deleteOne({ email })

    if (user) {
      // Generate token and set HTTP-only cookie
      generateTokenAndSetCookie(res, user._id)

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "User registered successfully",
      })
    } else {
      const error = new Error("Invalid user data")
      error.statusCode = 400
      throw error
    }
  }),
)

// @route   POST /api/auth/login
// @desc    Login user & get token in HTTP-only cookie
// @access  Public
router.post(
  "/login",
  loginValidator,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg)
      error.statusCode = 400
      throw error
    }

    const { email, password } = req.body

    // Check for user with password field
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      const error = new Error("Invalid credentials")
      error.statusCode = 401
      throw error
    }

    // Check if user is active
    if (!user.isActive) {
      const error = new Error("Account is deactivated. Please contact support")
      error.statusCode = 403
      throw error
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password)

    if (!isPasswordMatch) {
      const error = new Error("Invalid credentials")
      error.statusCode = 401
      throw error
    }

    // Generate token and set HTTP-only cookie
    generateTokenAndSetCookie(res, user._id)

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Login successful",
    })
  }),
)

// @route   POST /api/auth/logout
// @desc    Logout user & clear cookie
// @access  Private
router.post(
  "/logout",
  protect,
  asyncHandler(async (req, res) => {
    clearCookie(res)

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  }),
)

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    res.status(200).json({
      success: true,
      data: user,
    })
  }),
)

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put(
  "/update-profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.phone = req.body.phone || user.phone

      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address,
        }
      }

      const updatedUser = await user.save()

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address,
        },
        message: "Profile updated successfully",
      })
    } else {
      const error = new Error("User not found")
      error.statusCode = 404
      throw error
    }
  }),
)

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  "/change-password",
  protect,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      const error = new Error("Please provide current and new password")
      error.statusCode = 400
      throw error
    }

    if (newPassword.length < 6) {
      const error = new Error("New password must be at least 6 characters")
      error.statusCode = 400
      throw error
    }

    const user = await User.findById(req.user._id).select("+password")

    // Check current password
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      const error = new Error("Current password is incorrect")
      error.statusCode = 401
      throw error
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    })
  }),
)

// @route   POST /api/auth/register-admin
// @desc    Register a new admin (requires ADMIN_SECRET_KEY)
// @access  Public with secret key
router.post(
  "/register-admin",
  registerValidator,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg)
      error.statusCode = 400
      throw error
    }

    const { name, email, password, adminSecretKey } = req.body

    // Verify admin secret key
    if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      const error = new Error("Invalid admin secret key")
      error.statusCode = 403
      throw error
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      const error = new Error("User already exists with this email")
      error.statusCode = 400
      throw error
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    })

    if (user) {
      // Generate token and set HTTP-only cookie
      generateTokenAndSetCookie(res, user._id)

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "Admin registered successfully",
      })
    } else {
      const error = new Error("Invalid user data")
      error.statusCode = 400
      throw error
    }
  }),
)

export default router
