import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "../models/user.model.js"

dotenv.config()

const createAdmin = async () => {
  try {
    console.log("MONGODB_URI =", process.env.MONGODB_URI)

    await mongoose.connect(process.env.MONGODB_URI)

    console.log("MongoDB Connected...")

    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123456",
      role: "admin",
    }

    const existingAdmin = await User.findOne({ email: adminData.email })

    if (existingAdmin) {
      console.log("Admin user already exists with this email!")
      process.exit(1)
    }

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
    console.error("Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
