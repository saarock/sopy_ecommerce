import { useState, useEffect } from "react";
import productService from "../../services/productService";
import useUser from "../../hooks/useUser";

import { FaCheckCircle, FaTimesCircle, FaCog, FaUserCircle } from "react-icons/fa"; // Import icons
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BookedProductComp = () => {
  const [bookedProducts, setBookedProducts] = useState([]); // Holds the booked products
  const [loading, setLoading] = useState(false); // Loading state for UI
  const [error, setError] = useState(null); // Error state
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Number of products per page
  const [status, setStatus] = useState("pending"); // Status filter (pending, completed, etc.)
  const [search, setSearch] = useState(""); // Search term for product names
  const { user } = useUser(); // Assuming useUser hook provides the logged-in user
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [prevStatus, setPreStatus] = useState("");
  const [refetch, setRefetchTime] = useState(0);

  useEffect(() => {
    const fetchBookedProducts = async () => {
      setLoading(true);
      setError(null);
      if (status !== prevStatus) {
        setPage(1);
      }

      try {
        const data = await productService.getBookedProduct(
          status !== prevStatus ? 1 : page,
          limit,
          status,
          search,
          user?._id
        ); // Using user._id here
        setBookedProducts(data.data);
        setTotalPages(data.pagination.totalPages); // Set total pages for pagination
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
        setPreStatus(status);
      }
    };

    fetchBookedProducts();
  }, [page, limit, status, search, user?._id, refetch]); // Fetch data on page change, status, etc.

  const isCancellationWindowOpen = (createdAt) => {
    const orderTime = new Date(createdAt).getTime();
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    return now - orderTime < oneHour;
  };

  const getTimeRemaining = (createdAt) => {
    const orderTime = new Date(createdAt).getTime();
    const oneHour = 60 * 60 * 1000;
    const now = Date.now();
    const remaining = oneHour - (now - orderTime);
    if (remaining <= 0) return "Expired";
    const minutes = Math.floor(remaining / 60000);
    return `${minutes} minutes left`;
  };

  const handleCancelOrder = async (productId) => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }
    try {
      setLoading(true);
      const response = await productService.cancelOrder(productId);

      if (response.success) {
        toast.success("Order cancelled successfully");
        setBookedProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, status: "cancelled" }
              : product
          )
        );
        setRefetchTime((prev) => prev + 1);
      }
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (productId, newStatus) => {
    try {
      setLoading(true);
      const response = await productService.updateProductStatus(productId, newStatus);

      if (response.statusCode !== 200) {
        throw new Error(response.message || "Failed to update status");
      }

      setBookedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, status: newStatus }
            : product
        )
      );
      setRefetchTime((prev) => prev + 1);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = (product) => {
    if (product && product.status === "pending") {
      toast.error("You cannot generate a bill for a pending product.");
      return;
    }
    const billContent = `
            <html>
                <head>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: #f5f5f5;
                            padding: 40px 20px;
                        }
                        .bill-container { 
                            max-width: 800px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .bill-header { 
                            background: linear-gradient(135deg, #1a2250 0%, #2a3570 100%);
                            color: white;
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .bill-header h1 {
                            font-size: 32px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            letter-spacing: 1px;
                        }
                        .bill-header p {
                            font-size: 14px;
                            opacity: 0.9;
                            margin-top: 8px;
                        }
                        .bill-body {
                            padding: 40px 30px;
                        }
                        .bill-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 15px 0;
                            border-bottom: 1px solid #e5e7eb;
                        }
                        .bill-row:last-child {
                            border-bottom: none;
                        }
                        .bill-label {
                            color: #6b7280;
                            font-weight: 500;
                            font-size: 14px;
                        }
                        .bill-value {
                            color: #1a2250;
                            font-weight: 600;
                            font-size: 14px;
                        }
                        .bill-total {
                            background: #f9fafb;
                            padding: 20px 30px;
                            margin: 30px 0;
                            border-radius: 8px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .bill-total-label {
                            font-size: 18px;
                            font-weight: 600;
                            color: #1a2250;
                        }
                        .bill-total-value {
                            font-size: 28px;
                            font-weight: bold;
                            color: #1a2250;
                        }
                        .bill-footer { 
                            background: #f9fafb;
                            padding: 30px;
                            text-align: center;
                            border-top: 2px solid #e5e7eb;
                        }
                        .bill-footer p {
                            color: #6b7280;
                            font-size: 14px;
                            margin: 5px 0;
                        }
                        .bill-footer .thank-you {
                            color: #1a2250;
                            font-size: 16px;
                            font-weight: 600;
                            margin-top: 15px;
                        }
                        .status-badge {
                            display: inline-block;
                            padding: 6px 16px;
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .status-completed {
                            background: #d1fae5;
                            color: #065f46;
                        }
                        .status-pending {
                            background: #fef3c7;
                            color: #92400e;
                        }
                        .status-cancelled {
                            background: #fee2e2;
                            color: #991b1b;
                        }
                        @media print {
                            body {
                                padding: 0;
                                background: white;
                            }
                            .bill-container {
                                box-shadow: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="bill-container">
                        <div class="bill-header">
                            <h1>🧾 INVOICE</h1>
                            <p>Food Track - Your Trusted Partner</p>
                        </div>
                        <div class="bill-body">
                                <span class="bill-value">${product.product?.name || "Deleted Product"
      }</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-label">Booked By</span>
                                <span class="bill-value">${product.user?.fullName || product.user?.userName || "Unknown"
      }</span>
                            </div>
                            ${product.payment_gateway
        ? `
                            <div class="bill-row">
                                <span class="bill-label">Payment Gateway</span>
                                <span class="bill-value">${product.payment_gateway}</span>
                            </div>
                            `
        : ""
      }
                            <div class="bill-row">
                                <span class="bill-label">Total Items</span>
                                <span class="bill-value">${product.totalItems || 1
      }</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-label">Status</span>
                                <span class="status-badge status-${product.status
      }">${product.status}</span>
                            </div>
                            <div class="bill-total">
                                <span class="bill-total-label">Total Amount</span>
                                <span class="bill-total-value">RS ${product.price
      }</span>
                            </div>
                        </div>
                        <div class="bill-footer">
                            <p>Invoice Date: ${new Date().toLocaleDateString()}</p>
                            <p>Transaction ID: ${product._id}</p>
                            <p class="thank-you">Thank you for booking with us!</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
  };

  const generateTotalBill = async (userId, status) => {
    try {
      setLoading(true);
      const response = await productService.generateBill(userId, status);
      if (response && response.success) {
        handleGenerateFullBill(response.data);
      } else {
        throw new Error(response.message || "Failed to generate bill");
      }
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFullBill = (billData) => {
    const { allTheDetails, anotherPrice, userName } = billData;

    const itemRows = allTheDetails
      .map(
        (item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>RS ${item.perPPrice}</td>
                <td>${item.totalItems}</td>
                <td>RS ${item.soTheMultiPrice}</td>
                <td><span class="status-badge status-${item.status}">${item.status
          }</span></td>
            </tr>
        `
      )
      .join("");

    const billContent = `
            <html>
                <head>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: #f5f5f5;
                            padding: 40px 20px;
                        }
                        .bill-container { 
                            max-width: 900px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .bill-header { 
                            background: linear-gradient(135deg, #1a2250 0%, #2a3570 100%);
                            color: white;
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .bill-header h1 {
                            font-size: 36px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            letter-spacing: 1px;
                        }
                        .bill-header h2 {
                            font-size: 22px;
                            font-weight: 500;
                            opacity: 0.95;
                            margin-top: 10px;
                        }
                        .bill-header h3 {
                            font-size: 16px;
                            font-weight: 400;
                            opacity: 0.9;
                            margin-top: 15px;
                        }
                        .bill-body {
                            padding: 40px 30px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        thead {
                            background: #1a2250;
                            color: white;
                        }
                        th {
                            padding: 16px;
                            text-align: center;
                            font-weight: 600;
                            font-size: 14px;
                            letter-spacing: 0.5px;
                            text-transform: uppercase;
                        }
                        td {
                            padding: 16px;
                            text-align: center;
                            border-bottom: 1px solid #e5e7eb;
                            color: #374151;
                            font-size: 14px;
                        }
                        tbody tr:hover {
                            background: #f9fafb;
                        }
                        tbody tr:last-child td {
                            border-bottom: none;
                        }
                        .bill-total {
                            background: #f9fafb;
                            padding: 25px 30px;
                            margin: 30px 0;
                            border-radius: 8px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border: 2px solid #1a2250;
                        }
                        .bill-total-label {
                            font-size: 20px;
                            font-weight: 700;
                            color: #1a2250;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                        .bill-total-value {
                            font-size: 32px;
                            font-weight: bold;
                            color: #1a2250;
                        }
                        .bill-footer {
                            background: #f9fafb;
                            padding: 30px;
                            text-align: center;
                            border-top: 2px solid #e5e7eb;
                        }
                        .bill-footer p {
                            color: #6b7280;
                            font-size: 14px;
                            margin: 5px 0;
                        }
                        .bill-footer .thank-you {
                            color: #1a2250;
                            font-size: 18px;
                            font-weight: 600;
                            margin-top: 15px;
                        }
                        .status-badge {
                            display: inline-block;
                            padding: 6px 14px;
                            border-radius: 20px;
                            font-size: 11px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .status-completed {
                            background: #d1fae5;
                            color: #065f46;
                        }
                        .status-pending {
                            background: #fef3c7;
                            color: #92400e;
                        }
                        .status-cancelled {
                            background: #fee2e2;
                            color: #991b1b;
                        }
                        @media print {
                            body {
                                padding: 0;
                                background: white;
                            }
                            .bill-container {
                                box-shadow: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="bill-container">
                        <div class="bill-header">
                            <h1>Food Track</h1>
                            <h2>🧾 Complete Invoice</h2>
                            <h3>Customer: ${userName}</h3>
                        </div>
                        <div class="bill-body">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Item Name</th>
                                        <th>Per Item Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemRows}
                                </tbody>
                            </table>
                            <div class="bill-total">
                                <span class="bill-total-label">Grand Total</span>
                                <span class="bill-total-value">Rs. ${anotherPrice}</span>
                            </div>
                        </div>
                        <div class="bill-footer">
                            <p>Invoice Date: ${new Date().toLocaleDateString()}</p>
                            <p>Generated on: ${new Date().toLocaleString()}</p>
                            <p class="thank-you">Thank you for your purchase!</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Loading and Error Handling */}
      {loading && <LoadingSpinner />}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
        {user && user?.role === "admin" ? (
          <input
            type="text"
            placeholder="Search by User Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2250] focus:border-transparent mb-4"
          />
        ) : (
          <input
            type="text"
            placeholder="Search by Product Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2250] focus:border-transparent mb-4"
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setStatus("pending");
            }}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${status === "pending"
              ? "bg-[#1a2250] text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Pending
          </button>

          <button
            onClick={() => {
              setStatus("completed");
            }}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${status === "completed"
              ? "bg-[#1a2250] text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Completed
          </button>
          <button
            onClick={() => {
              setStatus("cancelled");
            }}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${status === "cancelled"
              ? "bg-[#1a2250] text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Displaying Booked Products */}
      <div className="space-y-4">
        {bookedProducts?.length > 0 ? (
          bookedProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1a2250] mb-2">
                      {product.product?.name || "Deleted Product"}
                    </h3>
                    <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-xl">
                      {product.user?.avatar ? (
                        <img
                          src={product.user.avatar}
                          alt={product.user.fullName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-tight">
                          {product.user?.fullName || "No Name"}
                        </span>
                        <span className="text-xs text-gray-500">
                          @{product.user?.userName || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <p>
                      <span className="font-medium">Total Items:</span>{" "}
                      {product.totalItems}
                    </p>
                    <p>
                      <span className="font-medium">Product Name:</span>{" "}
                      {product.product?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm font-medium ${product.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : product.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {product.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Product Price */}
                <div className="lg:text-right">
                  <span className="text-2xl font-bold text-[#1a2250]">
                    RS {product.price}
                  </span>
                </div>
              </div>

              {user &&
                user?.role === "user" &&
                (product.user?._id === user?._id || product.user === user?._id) &&
                product.status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {isCancellationWindowOpen(product.createdAt) ? (
                        <div className="flex flex-col gap-2">
                          <button
                            disabled={loading}
                            onClick={() => handleCancelOrder(product._id)}
                            className="flex items-center justify-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all duration-200 shadow-md hover:scale-105"
                          >
                            <FaTimesCircle /> Cancel Order
                          </button>
                          <span className="text-xs text-red-500 font-semibold animate-pulse">
                            Time remaining: {getTimeRemaining(product.createdAt)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                          Cancellation window expired (1 hour passed)
                        </div>
                      )}
                      <p className="text-xs text-gray-400 font-medium max-w-[200px]">
                        * Self-cancellation is only available within 1 hour of booking.
                      </p>
                    </div>
                  </div>
                )}

              {/* Admin Actions */}
              {user?.role === "admin" && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                    <button
                      disabled={product.status === "pending" || loading}
                      onClick={() =>
                        handleChangeStatus(product._id, "pending")
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <FaCog /> Pending
                    </button>
                    <button
                      disabled={product.status === "completed" || loading}
                      onClick={() =>
                        handleChangeStatus(product._id, "completed")
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <FaCheckCircle /> Completed
                    </button>
                    <button
                      disabled={product.status === "cancelled" || loading}
                      onClick={() =>
                        handleChangeStatus(product._id, "cancelled")
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <FaTimesCircle /> Cancelled
                    </button>
                    <button
                      onClick={() => handleGenerateBill(product)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a2250] text-white rounded-lg hover:bg-[#233166] transition-colors duration-200"
                    >
                      <FaCheckCircle /> Generate Bill
                    </button>
                    <button
                      onClick={() =>
                        generateTotalBill(product.user?._id, status)
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a2250] text-white rounded-lg hover:bg-[#233166] transition-colors duration-200 sm:col-span-2 lg:col-span-1"
                    >
                      <FaCheckCircle /> Generate Total Bill for{" "}
                      {product.user?.userName || "User"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No booked products found</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-300">
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
          Showing <span className="text-[#1a2250]">{bookedProducts.length}</span> items
        </p>

        <div className="flex items-center gap-4">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
            className="group flex items-center gap-3 px-8 py-4 bg-white text-[#1a2250] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#1a2250] hover:text-white disabled:opacity-30 disabled:grayscale transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Prev
          </button>

          <div className="flex items-center gap-2 px-6 py-4 bg-[#1a2250] rounded-2xl text-white font-black shadow-2xl shadow-[#1a2250]/20">
            <span className="opacity-40 text-[10px] uppercase tracking-widest mr-1">Page</span>
            <span className="text-sm">{page}</span>
            <span className="opacity-20 font-medium mx-1">/</span>
            <span className="text-sm">{totalPages}</span>
          </div>

          <button
            disabled={page === totalPages || bookedProducts?.length <= 0 || loading}
            onClick={() => setPage(page + 1)}
            className="group flex items-center gap-3 px-8 py-4 bg-white text-[#1a2250] rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-gray-100 hover:bg-[#1a2250] hover:text-white disabled:opacity-30 disabled:grayscale transition-all duration-300"
          >
            Next
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookedProductComp;
