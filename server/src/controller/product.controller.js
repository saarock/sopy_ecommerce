import BuyProducts from "../models/buyProduct.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import moment from "moment";
import { notifyAllAdmins, notifyUser, notifyAllUsers } from "../utils/notificationService.js";

export const saveProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, expiryDate, stock, category, userId, lowStockThreshold } =
    req.body;

  //  Required field validation
  if (!name || !price || !category || !userId) {
    throw new ApiError(400, "Required fields are missing");
  }

  //  Stock validation
  if (stock && Number(stock) > 100) {
    throw new ApiError(400, "Stock cannot be more than 100");
  }
  if (stock && Number(stock) < 0) {
    throw new ApiError(400, "Stock cannot be negative");
  }

  //  Price validation
  if (isNaN(price) || Number(price) <= 0) {
    throw new ApiError(400, "Price must be a valid positive number");
  }

  //  Expiry date validation
  if (expiryDate) {
    const expDate = new Date(expiryDate);

    if (isNaN(expDate.getTime())) {
      throw new ApiError(400, "Invalid expiry date format");
    }

    if (expDate <= new Date()) {
      throw new ApiError(400, "Expiry date must be in the future");
    }
  }

  //  Prevent duplicate product (no previous data allowed with same name)
  const existingProduct = await Product.findOne({
    name: name.trim(),
    admin: userId,
  });

  if (existingProduct) {
    throw new ApiError(409, "Product with this name already exists");
  }

  const newUser = await User.findById(userId);
  if (!newUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the user is an admin
  if (newUser.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to add products" });
  }

  // Validate the product data
  if (!name || !description || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if there's an image uploaded
  let imageUrl = null;
  if (req.file) {
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

    if (cloudinaryResponse) {
      imageUrl = cloudinaryResponse.secure_url; // Get the URL of the uploaded image
    } else {
      return res.status(500).json({ message: "Image upload failed" });
    }

    // Optionally, remove the local file after uploading
    fs.unlinkSync(req.file.path);
  }

  // Create a new product object
  const newProduct = {
    name,
    description,
    price,
    imageUrl, // Save the image URL from Cloudinary
    expiryDate,
    stock,
    category,
    admin: newUser,
    lowStockThreshold: Number(lowStockThreshold) || 5,
  };

  const product = new Product(newProduct);
  // Save the product to the database
  await product.save();

  // Check for low stock on new product
  if (product.stock <= product.lowStockThreshold) {
    await notifyAllAdmins(
      `Low stock alert: New product "${product.name}" has only ${product.stock} item(s) in stock.`,
      'low_stock_alert',
      { productId: product._id, currentStock: product.stock }
    );
  }

  // Notify all admins about new product
  await notifyAllAdmins(
    `New product "${product.name}" has been added to the inventory.`,
    'product_created',
    { productId: product._id, productName: product.name, price: product.price }
  );

  res
    .status(201)
    .json(new ApiResponse(200, "Product Added Successfull", product));
});

// Paginated getAllProducts route
export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 4,
    search = "",
    categoryFilter = "",
    availabilityFilter = "",
    disabled = 2,
    minPrice,
    maxPrice
  } = req.query; // Default to page 1 and 4 items per page

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  // Calculate the skip value for MongoDB (which items to skip)
  const skip = (pageNumber - 1) * limitNumber;

  const filters = {};

  // Search filter
  if (search.trim()) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Category filter (if provided and not "2")
  if (categoryFilter !== "2" && categoryFilter.trim()) {
    filters.category = categoryFilter;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  // Availability filter (if provided and not "2")
  if (availabilityFilter !== "2" && availabilityFilter.trim()) {
    if (availabilityFilter === "1") {
      // Products with stock > 0 (available)
      filters.stock = { $gt: 0 }; // More than 0 stock
    } else if (availabilityFilter === "0") {
      // Products with stock == 0 (out of stock)
      filters.stock = 0; // Out of stock
    } else if (availabilityFilter === "low") {
      // Products where stock <= lowStockThreshold (default to 5 if not set)
      filters.$expr = { $lte: ["$stock", { $ifNull: ["$lowStockThreshold", 5] }] };
    }
  }

  // Disabled filter (if not "2", handle availability status)
  if (disabled !== "2") {
    // "1" means disabled value to here only at other same upper rules
    filters.isAvailable = disabled !== "0";
  }

  console.log(filters);

  try {
    const products = await Product.find(filters)
      .skip(skip) // Skip the items based on pagination
      .limit(limitNumber); // Limit the number of items per page

    const totalProducts = await Product.countDocuments(filters); // Get the total number of products
    const totalPages = Math.ceil(totalProducts / limitNumber); // Calculate total pages

    res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          currentPage: pageNumber,
          totalPages,
          totalProducts,
        },
        "Products fetched successfully"
      )
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const BuyProduct = asyncHandler(async (req, res) => {
  try {
    const products = req.body;
    console.log(products);

    if (!products || products.length <= 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Use a for...of loop instead of forEach to handle async/await properly
    for (const product of products) {
      const alreadySavedProduct = await Product.findById(product.productId);
      if (!alreadySavedProduct) {
        throw new Error("No product found while buying Product");
      }

      if (alreadySavedProduct.stock <= 0) {
        return res.status(500).json({ message: "No stock available" });
      }

      // Update product stock
      alreadySavedProduct.stock -= parseInt(product.totalItem);

      // Check for low stock
      if (alreadySavedProduct.stock <= 5) {
        await notifyAllAdmins(
          `Low stock alert: "${alreadySavedProduct.name}" has only ${alreadySavedProduct.stock} item(s) left.`,
          'low_stock_alert',
          { productId: alreadySavedProduct._id, currentStock: alreadySavedProduct.stock }
        );
      }

      // Save the updated product
      await alreadySavedProduct.save();

      // Record the purchase in BuyProducts
      await BuyProducts.create({
        user: product.userId,
        product: product.productId,
        price: parseInt(product.totalPrice),
        totalItems: parseInt(product.totalItem),
        payment_gateway: "Cash",
      });

      // Notify user about purchase
      await notifyUser(
        product.userId,
        `You have purchased "${product.productName}", ${product.totalItem} item(s) for RS ${product.totalPrice}.`,
        'purchase_completed',
        { productId: product.productId, productName: product.productName, totalItems: product.totalItem, totalPrice: product.totalPrice }
      );

      // Notify admins about the purchase
      await notifyAllAdmins(
        `New order: "${product.productName}" - ${product.totalItem} item(s) purchased.`,
        'order_placed',
        { productId: product.productId, productName: product.productName, totalItems: product.totalItem, userId: product.userId }
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product bought successfully"));
  } catch (error) {
    console.error("Error during product purchase:", error);
    return res.status(500).json({ message: error.message });
  }
});

// Controller to manage booked products
export const manageBookedProduct = asyncHandler(async (req, res) => {
  // Extract query parameters (with default values)
  const { page = 1, limit = 10, status, search = "", id } = req.query;

  if (!id || id === undefined || id === "undefined") {
    throw new Error("No id available");
  }
  // Find the user by id
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const skip = (page - 1) * limit; // Pagination skip logic

  // Admin logic (fetch all booked products)
  if (user.role === "admin") {
    // Search filter based on the search term (username or full name search)
    let searchFilter = {};
    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { userName: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
        ]
      }).select("_id");
      const userIds = matchingUsers.map(u => u._id);
      searchFilter = { user: { $in: userIds } };
    }

    const bookedProducts = await BuyProducts.find({
      ...searchFilter,
      status: status || { $in: ["pending", "completed", "cancelled"] },
    })
      .populate("user", "userName fullName avatar") // Populate with the full details of the user who made the booking
      .populate("product", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sort by newest bookings

    // Count the total number of booked products for pagination
    const total = await BuyProducts.countDocuments({
      ...searchFilter,

      status: status || { $in: ["pending", "completed", "cancelled"] },
    });

    return res.status(200).json({
      success: true,
      data: bookedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit), // Calculate total pages
      },
    });
  }

  // User logic (fetch only the logged-in user's booked products)
  else {
    // Search filter based on the search term (username search)
    const searchFilter = search
      ? {
          product: await Product.findOne({
            name: { $regex: search, $options: "i" },
          }).select("_id"),
        }
      : {}; // If no search term, no filter is applied

    const bookedProducts = await BuyProducts.find({
      user: user._id,
      status: status || { $in: ["pending", "completed", "cancelled"] },
      ...searchFilter,
    })
      .skip(skip)
      .populate("product", "name")
      .populate("user", "userName fullName avatar")
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sort by newest bookings

    // Count the total number of bookings for the user
    const total = await BuyProducts.countDocuments({
      user: user._id,
      status: status || { $in: ["pending", "completed", "cancelled"] },
      ...searchFilter,
    });

    return res.status(200).json({
      success: true,
      data: bookedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit), // Calculate total pages
      },
    });
  }
});

// Controller to generate the bill for a user
export const generateBill = asyncHandler(async (req, res) => {
  const { userId, status } = req.query;

  const query = { user: userId };
  if (status) {
    query.status = status;
  }

  const products = await BuyProducts.find(query)
    .populate("product", "name price")
    .populate("user", "userName");

  if (!products || products.length <= 0) {
    return res.status(404).json({ message: "No products found for this user." });
  }

  let totalPrice = 0;
  const allTheDetails = products.map((product) => {
    const itemPrice = Number(product.price) || 0;
    totalPrice += itemPrice;
    
    return {
      name: product.product?.name || "Deleted Product",
      perPPrice: product.product?.price || 0,
      totalItems: product.totalItems || 0,
      soTheMultiPrice: itemPrice,
      status: product.status,
      payment_gateway: product.payment_gateway,
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      allTheDetails,
      anotherPrice: totalPrice,
      userName: products[0].user?.userName || "Unknown",
    }, "Bill generated successfully")
  );
});

export const changeStatusOfTheBookeditems = asyncHandler(async (req, res) => {
  const { productId, newStatus } = req.body;

  if (!productId || !newStatus) {
    throw new ApiError(400, "Product id and status are required");
  }

  const bookedProduct = await BuyProducts.findById(productId)
    .populate('user', 'userName')
    .populate('product', 'name stock');

  if (!bookedProduct) {
    throw new ApiError(404, "Booked product record not found");
  }

  const oldStatus = bookedProduct.status;
  
  // If status is actually changing
  if (oldStatus !== newStatus) {
    const originalProduct = await Product.findById(bookedProduct.product?._id);
    
    if (originalProduct) {
      // Logic for stock management
      const quantity = bookedProduct.totalItems || 0;

      // 1. Moving TO cancelled from something else -> Restore stock
      if (newStatus === "cancelled" && oldStatus !== "cancelled") {
        originalProduct.stock += quantity;
        await originalProduct.save();
      }
      // 2. Moving FROM cancelled to something else -> Deduct stock again
      else if (oldStatus === "cancelled" && newStatus !== "cancelled") {
        if (originalProduct.stock < quantity) {
          throw new ApiError(400, `Insufficient stock to restore this order. Current stock: ${originalProduct.stock}`);
        }
        originalProduct.stock -= quantity;
        await originalProduct.save();
      }
    }

    bookedProduct.status = newStatus;
    await bookedProduct.save();

    // Notify user about order status change
    await notifyUser(
      bookedProduct.user?._id,
      `Your order for "${bookedProduct.product?.name || 'Product'}" has been ${newStatus}.`,
      'order_status_changed',
      { orderId: productId, productName: bookedProduct.product?.name, status: newStatus }
    );

    // Notify admins about status change
    await notifyAllAdmins(
      `Order status changed: "${bookedProduct.product?.name || 'Product'}" is now ${newStatus}.`,
      'order_status_changed',
      { orderId: productId, productName: bookedProduct.product?.name, status: newStatus, userId: bookedProduct.user?._id }
    );
  }

  return res.status(200).json(
    new ApiResponse(200, bookedProduct, "Product status changed successfully")
  );
});

/**
 * User cancels their own order within 1 hour
 */
export const cancelOrderByUser = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user?._id;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const bookedProduct = await BuyProducts.findById(productId)
    .populate('product', 'name stock');

  if (!bookedProduct) {
    throw new ApiError(404, "Order not found");
  }

  // Check if order belongs to user
  if (bookedProduct.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to cancel this order");
  }

  // Check if already cancelled or completed
  if (bookedProduct.status === "cancelled") {
    throw new ApiError(400, "Order is already cancelled");
  }
  
  if (bookedProduct.status === "completed") {
    throw new ApiError(400, "Cannot cancel a completed order. Please contact admin.");
  }

  // Check 1 hour window (3600000 ms)
  const createdAt = new Date(bookedProduct.createdAt).getTime();
  const now = Date.now();
  const diff = now - createdAt;

  if (diff > 3600000) {
    throw new ApiError(400, "Cancellation window (1 hour) has expired. Please contact admin.");
  }

  // Restore stock
  const product = await Product.findById(bookedProduct.product?._id);
  if (product) {
    product.stock += (bookedProduct.totalItems || 0);
    await product.save();
  }

  bookedProduct.status = "cancelled";
  await bookedProduct.save();

  // Notify admins about user cancellation
  await notifyAllAdmins(
    `User "${req.user.userName}" cancelled their order for "${bookedProduct.product?.name || 'Product'}" within the 1-hour window.`,
    'order_cancelled_by_user',
    { orderId: productId, productName: bookedProduct.product?.name, userId }
  );

  return res.status(200).json(
    new ApiResponse(200, bookedProduct, "Order cancelled successfully")
  );
});

export const ChangeProdutAvailableSatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body; // The product ID should be in the request body

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      // If no product was found, return a 404 error
      return res.status(404).json({ message: "Product not found" });
    }

    product.isAvailable = !product.isAvailable;

    await product.save();

    // Notify admins about availability change
    await notifyAllAdmins(
      `Product "${product.name}" is now ${product.isAvailable ? 'available' : 'unavailable'}.`,
      'product_availability_changed',
      { productId: product._id, productName: product.name, isAvailable: product.isAvailable }
    );

    res
      .status(200)
      .json(new ApiResponse(200, product, "Unavailable successfully"));
  } catch (error) {
    // In case of an error, send a 500 status with the error message
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

export const deleteProducts = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body; // The product ID should be in the request body

    // Check if the product exists
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      // If no product was found, return a 404 error
      return res.status(404).json({ message: "Product not found" });
    }

    // Notify admins about product deletion
    await notifyAllAdmins(
      `Product "${product.name}" has been deleted from the inventory.`,
      'product_deleted',
      { productId: product._id, productName: product.name }
    );

    res
      .status(200)
      .json(new ApiResponse(200, product, "Product deleted successfully"));
  } catch (error) {
    // In case of an error, send a 500 status with the error message
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

export const editTheProducts = asyncHandler(async (req, res) => {
  const { productDetails } = req.body;

  // Validate product details
  if (!productDetails || typeof productDetails !== "object") {
    return res
      .status(400)
      .json({ message: "Product details are required and must be an object." });
  }

  const { id, name, description, price, stock } = productDetails;

  // Check if all required fields are provided and not null, undefined, or empty
  if (id == null || id === undefined || id.trim() === "") {
    return res
      .status(400)
      .json({ message: "Product ID is required and should not be empty." });
  }

  if (name == null || name === undefined || name.trim() === "") {
    return res
      .status(400)
      .json({ message: "Product name is required and should not be empty." });
  }

  console.log(price);
  if (price == null || price === undefined || price <= 0) {
    return res
      .status(400)
      .json({ message: "Product price should be a positive number." });
  }

  console.log(stock);
  if (stock == null || stock === undefined || stock < 0) {
    return res
      .status(400)
      .json({ message: "Product stock should be a non-negative number." });
  }
  if (
    description == null ||
    description === undefined ||
    description.trim() === ""
  ) {
    return res
      .status(400)
      .json({ message: "Descriptions should be not empty, null or undefined" });
  }

  // Validate field types
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id format." });
  }

  if (typeof name !== "string") {
    return res
      .status(400)
      .json({ message: "Product name should be a string." });
  }

  if (description && typeof description !== "string") {
    return res
      .status(400)
      .json({ message: "Product description should be a string if provided." });
  }

  try {
    // Proceed with updating the product (replace the following line with your update logic)

    const existingProduct = await Product.findOne({
      name: name.trim().toLowerCase(),
      _id: { $ne: id },
    });
    if (existingProduct) {
      throw new Error("Product with the same name already exists.");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...productDetails,
        stock: parseInt(stock),
        price: parseInt(price),
        lowStockThreshold: parseInt(lowStockThreshold) || 5,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check for low stock after edit
    if (updatedProduct.stock <= updatedProduct.lowStockThreshold) {
      await notifyAllAdmins(
        `Low stock alert: "${updatedProduct.name}" has only ${updatedProduct.stock} item(s) left.`,
        'low_stock_alert',
        { productId: updatedProduct._id, currentStock: updatedProduct.stock }
      );
    }

    // Notify admins about product update
    await notifyAllAdmins(
      `Product "${updatedProduct.name}" has been updated.`,
      'product_updated',
      { productId: updatedProduct._id, productName: updatedProduct.name, changes: productDetails }
    );

    // Respond with the updated product details
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, "Product edited successfully")
      );
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ message: error.message });
  }
});






export const getPurchaseStats = asyncHandler(async (req, res) => {
    try {
        const { userId, page = 1, limit = 10 } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch all purchases for basic stats
        const allUserPurchases = await BuyProducts.find({ user: userId });

        let totalSpent = 0;
        let completedCount = 0;
        let pendingCount = 0;
        let cancelledCount = 0;

        allUserPurchases.forEach(purchase => {
            if (purchase.status === "completed") {
                totalSpent += purchase.price;
                completedCount++;
            } else if (purchase.status === "pending") {
                pendingCount++;
            } else if (purchase.status === "cancelled") {
                cancelledCount++;
            }
        });

        // Global system counts (optional, kept from before but simplified)
        const totalUsersCount = await BuyProducts.distinct('user');
        const totalProductsCount = await BuyProducts.distinct('product');

        // Paginated purchases for the history table
        const paginatedPurchases = await BuyProducts.find({ user: userId })
            .populate("product", "name category imageUrl")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const totalPurchases = await BuyProducts.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalPurchases / limitNumber);

        // Map dates for the chart (still needed by frontend)
        const purchaseDates = allUserPurchases.map(p => moment(p.createdAt).format("YYYY-MM-DD"));

        return res.status(200).json({
            totalSpent,
            completedCount,
            pendingCount,
            cancelledCount,
            totalUsersCount: totalUsersCount.length,
            totalProductsCount: totalProductsCount.length,
            purchases: purchaseDates,
            history: {
                data: paginatedPurchases,
                currentPage: pageNumber,
                totalPages,
                totalItems: totalPurchases
            }
        });
    } catch (error) {
        console.error("Error fetching purchase stats:", error);
        res.status(500).json({ message: error.message });
    }
});


export const getAdminStats = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Total Users
        const totalUsers = await User.countDocuments();
        const activeUsersCount = await User.countDocuments({ isActive: true });

        // Total Products
        const totalProducts = await Product.countDocuments();
        const outOfStockProducts = await Product.countDocuments({ stock: 0 });
        const lowStockProducts = await Product.countDocuments({
            $expr: {
                $and: [
                    { $gt: ["$stock", 0] },
                    { $lte: ["$stock", { $ifNull: ["$lowStockThreshold", 5] }] }
                ]
            }
        });

        // Revenue and Bookings
        const bookings = await BuyProducts.find();
        
        let totalRevenue = 0;
        let completedBookings = 0;
        let pendingBookings = 0;
        let cancelledBookings = 0;
        let pendingCount = 0;


        bookings.forEach(booking => {
            if (booking.status === "completed") {
                totalRevenue += booking.price;
                completedBookings++;
            } else if (booking.status === "pending") {
                pendingCount++; // This was a bug in previous version too (pendingCount vs pendingBookings)
                pendingBookings++;
            } else if (booking.status === "cancelled") {
                cancelledBookings++;
            }
        });

        // Total count for recent bookings pagination
        const totalRecentBookings = await BuyProducts.countDocuments();

        // Recent Bookings (paginated)
        const recentBookings = await BuyProducts.find()
            .populate("user", "fullName userName avatar")
            .populate("product", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        // Category-wise product count
        const categoryStats = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.status(200).json(
            new ApiResponse(200, {
                totalUsers,
                activeUsers: activeUsersCount,
                totalProducts,
                outOfStockProducts,
                lowStockProducts,
                totalRevenue,
                completedBookings,
                pendingBookings,
                cancelledBookings,
                recentBookings: {
                    data: recentBookings,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalRecentBookings / limitNumber),
                    totalItems: totalRecentBookings
                },
                categoryStats
            }, "Admin stats fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: error.message });
    }
});
