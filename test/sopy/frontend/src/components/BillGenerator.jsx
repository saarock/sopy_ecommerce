
import { Printer } from "lucide-react"

export default function BillGenerator({ order }) {
    const handlePrint = () => {
        window.print()
    }

    if (!order) return null

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-8 print:shadow-none print:w-full print:max-w-none print:my-0">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                    <p className="text-gray-500">Order #{order._id}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-primary-600">ShopHub</h2>
                    <p className="text-gray-500">123 Commerce St.</p>
                    <p className="text-gray-500">Tech City, TC 90210</p>
                    <p className="text-gray-500">support@shophub.com</p>
                </div>
            </div>

            {/* Bill To / Ship To */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-gray-500 font-semibold mb-2 uppercase text-sm">Bill To</h3>
                    <p className="font-bold text-gray-900">{order.user?.name}</p>
                    <p className="text-gray-600">{order.user?.email}</p>
                </div>
                <div>
                    <h3 className="text-gray-500 font-semibold mb-2 uppercase text-sm">Ship To</h3>
                    <p className="font-bold text-gray-900">{order.shippingAddress?.address}</p>
                    <p className="text-gray-600">
                        {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress?.country}</p>
                </div>
            </div>

            {/* Order Details */}
            <div className="mb-8">
                <div className="grid grid-cols-2 gap-8 mb-4">
                    <div>
                        <span className="text-gray-500 font-semibold uppercase text-sm">Order Date:</span>
                        <span className="ml-2 text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 font-semibold uppercase text-sm">Payment Method:</span>
                        <span className="ml-2 text-gray-900">{order.paymentMethod}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 font-semibold text-gray-600">Item</th>
                        <th className="text-center py-3 font-semibold text-gray-600">Quantity</th>
                        <th className="text-right py-3 font-semibold text-gray-600">Price</th>
                        <th className="text-right py-3 font-semibold text-gray-600">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.orderItems.map((item) => (
                        <tr key={item._id} className="border-b border-gray-100">
                            <td className="py-4">
                                <p className="font-medium text-gray-900">{item.name}</p>
                            </td>
                            <td className="text-center py-4 text-gray-600">{item.quantity}</td>
                            <td className="text-right py-4 text-gray-600">${item.price.toFixed(2)}</td>
                            <td className="text-right py-4 font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>${(order.itemsPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax:</span>
                        <span>${(order.taxPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping:</span>
                        <span>${(order.shippingPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-3">
                        <span>Total:</span>
                        <span>${(order.totalPrice || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm print:hidden">
                <p>Thank you for shopping with ShopHub!</p>
                <button
                    onClick={handlePrint}
                    className="mt-4 btn-primary inline-flex items-center gap-2"
                >
                    <Printer className="w-4 h-4" />
                    Print Invoice
                </button>
            </div>
        </div>
    )
}
