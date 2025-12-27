import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/user.model.js"

dotenv.config()

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log("MongoDB Connected...")

    // Admin details - CHANGE THESE!
    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123456",
      role: "admin",
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email })

    if (existingAdmin) {
      console.log("Admin user already exists with this email!")
      process.exit(1)
    }

    // Create admin user
    const admin = await User.create(adminData)

    console.log("Admin user created successfully!")
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    })

    process.exit(0)
  } catch (error) {
    console.error("Error creating admin:", error.message)
    process.exit(1)
  }
}

createAdmin()
