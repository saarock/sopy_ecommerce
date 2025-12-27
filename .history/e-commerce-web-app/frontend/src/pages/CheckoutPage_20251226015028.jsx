"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { CreditCard } from "lucide-react"
import api from "../lib/api"
import { useCartStore } from "../store/cartStore"
import toast from "react-hot-toast"

let stripePromise = null

const CheckoutForm = ({ orderId, clientSecret }) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${orderId}`,
        },
        redirect: "if_required",
      })

      if (error) {
        toast.error(error.message)
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Update order as paid
        await api.put(`/orders/${orderId}/pay`, {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
        })

        toast.success("Payment successful!")
        navigate(`/orders/${orderId}`)
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button type="submit" disabled={!stripe || processing} className="w-full btn-primary">
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, fetchCart } = useCartStore()
  const [shippingInfo, setShippingInfo] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })
  const [order, setOrder] = useState(null)
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
    loadStripeKey()
  }, [])

  const loadStripeKey = async () => {
    try {
      const { data } = await api.get("/payment/config")
      stripePromise = loadStripe(data.publishableKey)
      setLoading(false)
    } catch (error) {
      toast.error("Failed to load payment system")
      setLoading(false)
    }
  }

  const handleCreateOrder = async (e) => {
    e.preventDefault()

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty")
      navigate("/cart")
      return
    }

    try {
      // Create order
      const orderData = await api.post("/orders", {
        shippingAddress: shippingInfo,
        paymentMethod: "Stripe",
      })

      const newOrder = orderData.data.data

      // Create payment intent
      const paymentData = await api.post("/payment/create-payment-intent", {
        orderId: newOrder._id,
      })

      setOrder(newOrder)
      setClientSecret(paymentData.data.data.clientSecret)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order")
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={shippingInfo.street}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    placeholder="USA"
                  />
                </div>
              </div>

              {!clientSecret && (
                <button type="submit" className="w-full btn-primary">
                  Continue to Payment
                </button>
              )}
            </form>
          </div>

          {/* Payment Form */}
          {clientSecret && stripePromise && (
            <div className="card mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h2>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm orderId={order._id} clientSecret={clientSecret} />
              </Elements>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="card sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {cart && (
              <>
                <div className="space-y-3 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{cart.totalAmount > 100 ? "FREE" : "$10.00"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>${(cart.totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">
                      ${(cart.totalAmount + (cart.totalAmount > 100 ? 0 : 10) + cart.totalAmount * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
