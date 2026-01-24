import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { encrypt } from "../utils/encryption.utils.js"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    passwordHistory: {
      type: [
        {
          password: {
            type: String,
            required: true,
          },
          changedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
  },
  {
    timestamps: true,
  },
)

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  // Handle Phone Encryption
  if (this.isModified("phone") && this.phone) {
    this.phone = encrypt(this.phone)
  }

  if (!this.isModified("password")) {
    return next()
  }

  // Password Reuse Check
  // We assume passwordHistory is available (selected). If strict check needed, ensure it's loaded.
  if (this.passwordHistory && this.passwordHistory.length > 0) {
    for (const entry of this.passwordHistory) {
      const isMatch = await bcrypt.compare(this.password, entry.password)
      if (isMatch) {
        const error = new Error("Cannot reuse any of the last 5 passwords")
        return next(error)
      }
    }
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt)

  // Add to history using the NEW hash
  // Initialize if undefined
  if (!this.passwordHistory) this.passwordHistory = []

  this.passwordHistory.unshift({
    password: hashedPassword,
    changedAt: Date.now()
  })

  // Keep only last 5
  if (this.passwordHistory.length > 5) {
    this.passwordHistory = this.passwordHistory.slice(0, 5)
  }

  this.password = hashedPassword
  this.passwordChangedAt = Date.now()
})

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex")

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model("User", userSchema)
