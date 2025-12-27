import express from "express"
import Stripe from "stripe"
import { asyncHandler } from "../middleware/error.middleware.js"
import { protect } from "../middleware/auth.middleware.js"
import Order from "../models/order.model.js"

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// @route   POST /api/payment/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post(
  "/create-payment-intent",
  protect,
  asyncHandler(async (req, res) => {
    const { orderId } = req.body

    if (!orderId) {
      const error = new Error("Order ID is required")
      error.statusCode = 400
      throw error
    }

    const order = await Order.findById(orderId)

    if (!order) {
      const error = new Error("Order not found")
      error.statusCode = 404
      throw error
    }

    // Verify user is order owner
    if (order.user.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized to pay for this order")
      error.statusCode = 403
      throw error
    }

    if (order.isPaid) {
      const error = new Error("Order is already paid")
      error.statusCode = 400
      throw error
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
      },
    })
  }),
)

// @route   POST /api/payment/webhook
// @desc    Stripe webhook for payment events
// @access  Public (but verified by Stripe signature)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"]
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata.orderId

        // Update order status
        const order = await Order.findById(orderId)
        if (order) {
          order.isPaid = true
          order.paidAt = Date.now()
          order.status = "processing"
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
          }
          await order.save()

          console.log(`Order ${orderId} marked as paid`)
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        console.error(`Payment failed for intent: ${paymentIntent.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  }),
)

// @route   GET /api/payment/config
// @desc    Get Stripe publishable key
// @access  Public
router.get("/config", (req, res) => {
  res.status(200).json({
    success: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  })
})

export default router
