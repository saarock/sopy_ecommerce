import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  IndianRupee,
  Calendar,
  Tag,
  Package,
  Image,
  AlignLeft,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import productService from "../../services/productService";
import { handleResponse } from "../../utils";
import { categoryOptions } from "../../constant";


const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    expiryDate: "",
    category: "",
    product_image: null,
    stock: "",
    description: "",
    lowStockThreshold: 5,
    userId:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("userData") || "{}")?._id || ""
        : "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        product_image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (errors.product_image) {
        setErrors((prev) => ({ ...prev, product_image: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || Number.parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.product_image)
      newErrors.product_image = "Product image is required";
    if (!formData.stock || Number.parseInt(formData.stock) < 0)
      newErrors.stock = "Valid stock is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm();

    if (!formData.userId) {
      toast.warning("Please login first");
      setLoading(false);
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("expiryDate", formData.expiryDate);
    submitData.append("category", formData.category);
    submitData.append("stock", formData.stock);
    submitData.append("description", formData.description);
    submitData.append("lowStockThreshold", formData.lowStockThreshold);
    submitData.append("userId", formData.userId);
    if (formData.product_image)
      submitData.append("product_image", formData.product_image);

    try {
      const response = await handleResponse(
        productService.addProduct(submitData)
      );

      if (response.error) {
        toast.error(response?.error || "Invalid inputs.");
        return;
      } else {
        toast.success(response.data ?? "Product added successfully");
      }
      setFormData({
        name: "",
        price: "",
        expiryDate: "",
        category: "",
        product_image: null,
        stock: "",
        description: "",
        lowStockThreshold: 5,
        userId:
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("userData") || "{}")?._id || ""
            : "",
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error(error?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 relative">
          <div className="absolute -top-8 -left-8 w-40 h-40 bg-[rgba(16,21,64,0.05)] rounded-full blur-3xl" />
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-[rgba(16,21,64,0.03)] rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#101540] to-[#1a2060] text-white shadow-lg shadow-[rgba(16,21,64,0.3)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#101540]">
                  Add New Product
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Fill in the details to add a product to your inventory
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[rgba(16,21,64,0.1)] to-[rgba(16,21,64,0.05)] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-3xl shadow-xl shadow-[rgba(16,21,64,0.08)] border border-[rgba(16,21,64,0.1)] p-6 sm:p-8 lg:p-10 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Product Name */}
              <div className="group/field">
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-3"
                >
                  <Box className="w-5 h-5" />
                  Product Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${errors.name
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                      : "border-[rgba(16,21,64,0.15)] bg-white focus:border-[#101540] focus:ring-[rgba(16,21,64,0.1)] hover:border-[rgba(16,21,64,0.25)]"
                      }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-shake">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="group/field">
                <label
                  htmlFor="price"
                  className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-3"
                >
                  <IndianRupee className="w-5 h-5" />
                  Price (RS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${errors.price
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                      : "border-[rgba(16,21,64,0.15)] bg-white focus:border-[#101540] focus:ring-[rgba(16,21,64,0.1)] hover:border-[rgba(16,21,64,0.25)]"
                      }`}
                  />
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-shake">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Expiry Date */}
              <div className="group/field">
                <label
                  htmlFor="expiryDate"
                  className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-3"
                >
                  <Calendar className="w-5 h-5" />
                  Expiry Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${errors.expiryDate
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                      : "border-[rgba(16,21,64,0.15)] bg-white focus:border-[#101540] focus:ring-[rgba(16,21,64,0.1)] hover:border-[rgba(16,21,64,0.25)]"
                      }`}
                  />
                  {errors.expiryDate && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-shake">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="group/field">
                <label
                  htmlFor="category"
                  className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-3"
                >
                  <Tag className="w-5 h-5" />
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 appearance-none bg-white ${errors.category
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                      : "border-[rgba(16,21,64,0.15)] focus:border-[#101540] focus:ring-[rgba(16,21,64,0.1)] hover:border-[rgba(16,21,64,0.25)]"
                      }`}
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[#101540]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-shake">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="group/field md:col-span-2">
                <label
                  htmlFor="stock"
                  className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-3"
                >
                  <Package className="w-5 h-5" />
                  Stock Quantity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter available stock"
                    min="0"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${errors.stock
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                      : "border-[rgba(16,21,64,0.15)] bg-white focus:border-[#101540] focus:ring-[rgba(16,21,64,0.1)] hover:border-[rgba(16,21,64,0.25)]"
                      }`}
                  />
                  {errors.stock && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-shake">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>

              {/* Low Stock Threshold */}
              <div className="group/field md:col-span-2">
                <label
                  htmlFor="lowStockThreshold"
                  className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-3"
                >
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Low Stock Alert Threshold
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    placeholder="Enter threshold for low stock alert (e.g., 5)"
                    min="1"
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-[rgba(16,21,64,0.15)] bg-white focus:border-[#101540] focus:ring-[rgba(16,21,64,0.1)] hover:border-[rgba(16,21,64,0.25)] transition-all duration-300 focus:outline-none focus:ring-4"
                  />
                  <p className="mt-2 text-xs text-gray-500 italic">
                    * Administrators will be notified when stock reaches this level or below.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="group/field md:col-span-2">
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-3"
                >
                  <AlignLeft className="w-5 h-5" />
                  Product Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter detailed product description..."
                    rows={4}
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 resize-none ${errors.description
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                      : "border-[rgba(16,21,64,0.15)] bg-white focus:border-[#101540] focus:ring-[rgba(16,21,64,0.1)] hover:border-[rgba(16,21,64,0.25)]"
                      }`}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-shake">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Image */}
              <div className="group/field md:col-span-2">
                <label
                  htmlFor="product_image"
                  className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-3"
                >
                  <Image className="w-5 h-5" />
                  Product Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="product_image"
                    name="product_image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="product_image"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group/upload overflow-hidden ${errors.product_image
                      ? "border-red-300 bg-red-50 hover:border-red-400"
                      : "border-[rgba(16,21,64,0.2)] bg-[rgba(16,21,64,0.02)] hover:border-[#101540] hover:bg-[rgba(16,21,64,0.05)]"
                      }`}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101540]/80 to-transparent opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <p className="text-white font-semibold text-sm">
                            Click to change image
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <Image className="mx-auto text-[rgba(16,21,64,0.4)] mb-3 w-10 h-10 group-hover/upload:scale-110 group-hover/upload:text-[#101540] transition-all duration-300" />
                        <p className="text-sm font-semibold text-[#101540] mb-1">
                          Click to upload product image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, JPEG up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                  {errors.product_image && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-shake">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {errors.product_image}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-[rgba(16,21,64,0.1)]">
              <button
                type="submit"
                disabled={loading}
                className="relative group/btn px-8 py-4 rounded-2xl bg-gradient-to-br from-[#101540] to-[#1a2060] text-white font-bold text-lg shadow-xl shadow-[rgba(16,21,64,0.3)] hover:shadow-2xl hover:shadow-[rgba(16,21,64,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                      Add Product
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;
