import express from "express"
import Stripe from "stripe"
import axios from "axios"
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

// @route   POST /api/payment/khalti/initiate
// @desc    Initiate Khalti payment
// @access  Private
router.post(
  "/khalti/initiate",
  protect,
  asyncHandler(async (req, res) => {
    const { orderId } = req.body
    const order = await Order.findById(orderId)

    if (!order) {
      res.status(404)
      throw new Error("Order not found")
    }

    if (order.isPaid) {
      res.status(400)
      throw new Error("Order is already paid")
    }

    if (!process.env.KHALTI_SECRET_KEY) {
      console.error("KHALTI_SECRET_KEY is missing in .env")
      res.status(500)
      throw new Error("Server configuration error: Khalti key missing")
    }

    const payload = {
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/orders/${orderId}`,
      website_url: process.env.FRONTEND_URL || "http://localhost:5173",
      amount: Math.round(order.totalPrice * 100), // Khalti expects amount in paisa (WARNING: Assumes 1:1 currency or converts USD->NPR implicitly by value)
      purchase_order_id: order._id,
      purchase_order_name: `Order #${order._id}`,
      customer_info: {
        name: req.user.name,
        email: req.user.email,
      },
    }

    console.log("Initiating Khalti Payment with payload:", JSON.stringify(payload, null, 2))

    try {
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        payload,
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )
      
      console.log("Khalti Response:", response.data)
      res.json(response.data)
    } catch (error) {
      console.error("Khalti Initiate Error Details:", error.response?.data || error.message)
      res.status(400)
      // Pass the specific Khalti error message back to frontend if available
      const khaltiMessage = error.response?.data?.detail || error.response?.data?.amount?.[0] || "Failed to initiate Khalti payment"
      throw new Error(khaltiMessage)
    }
  })
)

// @route   POST /api/payment/khalti/verify
// @desc    Verify Khalti payment
// @access  Private
router.post(
  "/khalti/verify",
  protect,
  asyncHandler(async (req, res) => {
    const { pidx } = req.body

    try {
      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/lookup/",
        { pidx },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )

      const { status, total_amount, purchase_order_id } = response.data

      if (status === "Completed") {
        const order = await Order.findById(purchase_order_id)

        if (order) {
          order.isPaid = true
          order.paidAt = Date.now()
          order.status = "processing"
          order.paymentMethod = "Khalti"
          order.paymentResult = {
            id: pidx,
            status,
            update_time: new Date().toISOString(),
          }
          await order.save()

          res.json({ success: true, order })
        } else {
          res.status(404)
          throw new Error("Order not found")
        }
      } else {
        res.status(400)
        throw new Error("Payment not completed")
      }
    } catch (error) {
       console.error("Khalti Verify Error:", error.response?.data || error.message)
       res.status(400)
       throw new Error("Payment verification failed")
    }
  })
)

export default router
