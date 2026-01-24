import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 */
export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Sopy E-commerce" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email - Sopy E-commerce",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p>Hello,</p>
        <p>Your verification code for Sopy E-commerce is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Sopy E-commerce. All rights reserved.</p>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent: %s", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

/**
 * Send Reset Password email
 * @param {string} email - Recipient email
 * @param {string} resetUrl - Reset URL
 */
export const sendResetPasswordEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: `"Sopy E-commerce" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Request - Sopy E-commerce",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="text-align: center; word-break: break-all; color: #666; font-size: 14px;">Or copy and paste this link into your browser:<br>${resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 Sopy E-commerce. All rights reserved.</p>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent: %s", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

/**
 * Generate 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
