"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { CreditCard, ShoppingBag, MapPin, Loader2, ArrowRight, Wallet } from "lucide-react"
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
      console.error(error);
      toast.error("Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
          </>
        ) : (
          <>
            Pay Now
          </>
        )}
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
  const [paymentMethod, setPaymentMethod] = useState("Stripe")
  const [processingKhalti, setProcessingKhalti] = useState(false)

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
      console.error(error)
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
        paymentMethod: paymentMethod,
      })

      const newOrder = orderData.data.data
      setOrder(newOrder)

      if (paymentMethod === "Stripe") {
        const paymentData = await api.post("/payment/create-payment-intent", {
          orderId: newOrder._id,
        })
        setClientSecret(paymentData.data.data.clientSecret)
        toast.success("Order created! Please complete payment.")
      } else if (paymentMethod === "Khalti") {
        setProcessingKhalti(true)
        const khaltiData = await api.post("/payment/khalti/initiate", {
          orderId: newOrder._id,
        })
        if (khaltiData.data.payment_url) {
          window.location.href = khaltiData.data.payment_url
        } else {
          toast.error("Failed to initiate Khalti payment")
          setProcessingKhalti(false)
        }
      }

    } catch (error) {
      console.error(error)
      let message = error.response?.data?.message || "Failed to create order"

      // Check for 404 on Khalti route specifically
      if (paymentMethod === "Khalti" && error.response?.status === 404) {
        message = "Khalti service not found. Please restart your backend server."
      }

      toast.error(message)
      setProcessingKhalti(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Shipping & Payment */}
        <div className="space-y-8">
          {/* Section 1: Shipping */}
          <div className={`glass-card pt-6 pb-6 ${clientSecret || processingKhalti ? 'opacity-60 pointer-events-none grayscale' : ''}`}>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              Shipping Information
            </h2>
            <form id="shipping-form" onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-700">Street Address</label>
                <input
                  type="text"
                  required
                  className="input w-full"
                  value={shippingInfo.street}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700">City</label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700">State</label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700">ZIP Code</label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700">Country</label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    placeholder="USA"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="pt-4 border-t border-zinc-100">
                <h3 className="font-semibold text-zinc-900 mb-3">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Stripe")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${paymentMethod === "Stripe"
                      ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500 text-primary-700"
                      : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
                      }`}
                  >
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Khalti")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${paymentMethod === "Khalti"
                      ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500 text-purple-700"
                      : "border-zinc-200 hover:border-zinc-300 text-zinc-600"
                      }`}
                  >
                    <Wallet className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">Khalti Wallet</span>
                  </button>
                </div>
              </div>

              {!clientSecret && !processingKhalti && (
                <button type="submit" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                  {paymentMethod === "Stripe" ? "Continue to Card Payment" : "Pay with Khalti"} <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {processingKhalti && (
                <div className="w-full mt-6 flex items-center justify-center gap-2 text-purple-600 font-medium">
                  <Loader2 className="w-5 h-5 animate-spin" /> Redirecting to Khalti...
                </div>
              )}
            </form>
          </div>

          {/* Section 2: Payment */}
          {clientSecret && stripePromise && (
            <div className="glass-card animate-fadeIn">
              <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" />
                Payment Information
              </h2>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm orderId={order._id} clientSecret={clientSecret} />
              </Elements>
            </div>
          )}
        </div>

        {/* Right Col: Order Summary */}
        <div>
          <div className="glass-card sticky top-24">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-500" />
              Order Summary
            </h2>

            {cart && (
              <>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex gap-4">
                      <div className="w-16 h-16 bg-zinc-100 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.images?.[0]?.url ? (
                          <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300"><ShoppingBag className="w-6 h-6" /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-900 line-clamp-2">{item.product.name}</p>
                        <p className="text-xs text-zinc-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-zinc-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-100 pt-4 space-y-2">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping</span>
                    <span>{cart.totalAmount > 100 ? "FREE" : "$10.00"}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Tax (10%)</span>
                    <span>${(cart.totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-zinc-200 pt-3 flex justify-between text-lg font-bold text-zinc-900">
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
