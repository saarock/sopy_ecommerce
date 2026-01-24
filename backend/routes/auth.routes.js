import express from "express"
import { validationResult } from "express-validator"
import { asyncHandler } from "../middleware/error.middleware.js"
import { protect } from "../middleware/auth.middleware.js"
import { registerValidator, loginValidator } from "../utils/validators.js"
import User from "../models/user.model.js"
import OTP from "../models/otp.model.js"
import { generateTokenAndSetCookie, clearCookie } from "../utils/jwt.utils.js"
import { sendOTPEmail, generateOTP, sendResetPasswordEmail } from "../utils/otp.utils.js"
import crypto from "crypto"
import { encrypt, decrypt } from "../utils/encryption.utils.js"
import { verifyRecaptcha } from "../utils/recaptcha.utils.js"

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

    const { email, password, recaptchaToken } = req.body

    // Verify reCAPTCHA
    if (recaptchaToken) { // Make optional based on frontend impl? Or mandatory? 
      // User requested adding it, imply mandatory if implemented.
      // However, existing tests/clients might break.
      // Let's check: if token provided, verify it. If we want to enforce it, we just check !token.
      // Given user asked for "CAPTCHA / lockout", let's verify if present. 
      // Frontend will force presence.
      const isHuman = await verifyRecaptcha(recaptchaToken)
      if (!isHuman) {
        const error = new Error("CAPTCHA verification failed. Are you a robot?")
        error.statusCode = 400
        throw error
      }
    } else {
      // Should we enforce it? Yes, otherwise what's the point?
      // But maybe only enforce after failed attempts? 
      // "CAPTCHA / lockout" implies lockout OR captcha.
      // Let's enforce it always for login if we are implementing it.
      // But wait, user just gave me keys. I should enforce it.
      const error = new Error("Please complete the CAPTCHA")
      error.statusCode = 400
      throw error
    }

    // Check for user with password field
    const user = await User.findOne({ email }).select("+password +passwordHistory")

    if (!user) {
      const error = new Error("Invalid credentials")
      error.statusCode = 401
      throw error
    }

    // Check account lockout
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000)
      const error = new Error(`Account locked. Please try again in ${remainingTime} minutes.`)
      error.statusCode = 423
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
      // Increment failed attempts
      user.failedLoginAttempts += 1

      // Lock account if attempts >= 5
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000 // 15 minutes
        user.failedLoginAttempts = 0 // Optional: reset attempts after locking or keep them? Usually reset or keep. Let's reset so they get fresh attempts after timeout.
      }

      await user.save({ validateBeforeSave: false })

      const error = new Error("Invalid credentials")
      error.statusCode = 401
      throw error
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0
    user.lockUntil = undefined
    await user.save({ validateBeforeSave: false })

    // Check password expiry (90 days)
    const ninetyDays = 90 * 24 * 60 * 60 * 1000
    const isPasswordExpired = user.passwordChangedAt && Date.now() - user.passwordChangedAt > ninetyDays

    // Generate token and set HTTP-only cookie
    generateTokenAndSetCookie(res, user._id)

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordExpired: isPasswordExpired, // Inform frontend
      },
      message: isPasswordExpired ? "Login successful but password expired" : "Login successful",
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

    // Decrypt phone if exists
    if (user.phone) {
      user.phone = decrypt(user.phone)
    }

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

    const user = await User.findById(req.user._id).select("+password +passwordHistory")

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

// @route   POST /api/auth/forgot-password
// @desc    Forgot Password
// @access  Public
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      const error = new Error("User not found with that email")
      error.statusCode = 404
      throw error
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    // Create reset url
    // For local development, assume frontend is on port 5173 or the referer
    // You might want to make this configurable via env var
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`

    try {
      await sendResetPasswordEmail(user.email, resetUrl)

      res.status(200).json({
        success: true,
        message: "Email sent",
      })
    } catch (err) {
      console.log(err)
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save({ validateBeforeSave: false })

      const error = new Error("Email could not be sent")
      error.statusCode = 500
      throw error
    }
  }),
)

// @route   PUT /api/auth/reset-password/:resetToken
// @desc    Reset Password
// @access  Public
router.put(
  "/reset-password/:resetToken",
  asyncHandler(async (req, res) => {
    const { password } = req.body

    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+passwordHistory")

    if (!user) {
      const error = new Error("Invalid token")
      error.statusCode = 400
      throw error
    }

    // Set new password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated success",
    })
  }),
)

export default router
