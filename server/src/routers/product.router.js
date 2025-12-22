import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  BuyProduct,
  ChangeProdutAvailableSatus,
  cancelOrderByUser,
  changeStatusOfTheBookeditems,
  deleteProducts,
  editTheProducts,
  generateBill,
  getAllProducts,
  getPurchaseStats,
  manageBookedProduct,
  saveProduct,
  getAdminStats,
} from "../controller/product.controller.js";
import CryptoJS from "crypto-js";

const router = Router();

router.post(
  "/saveProduct",
  verifyJWT,
  upload.single("product_image"),
  saveProduct
);
router.get("/getProducts", verifyJWT, getAllProducts);

router.post("/buy-products", verifyJWT, BuyProduct);
router.get("/manage-booked-product", verifyJWT, manageBookedProduct);
router.get("/generate-bill", verifyJWT, generateBill)
router.post("/change-status-of-booked-items", verifyJWT, changeStatusOfTheBookeditems);
router.post("/cancel-order", verifyJWT, cancelOrderByUser);
router.delete("/change-available", verifyJWT, ChangeProdutAvailableSatus);
router.put("/edit-product", verifyJWT, editTheProducts);
router.delete("/deleteProduct", verifyJWT, deleteProducts);
router.get("/admin-stats", verifyJWT, getAdminStats);


router.get("/get-purchaseStats", verifyJWT, getPurchaseStats);

router.post("/create-esewa-payment", (req, res) => {
  try {
    const { total_amount } = req.body;

    if (!total_amount || total_amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const transaction_uuid = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const product_code = process.env.ESEWA_MERCHANT_ID || "EPAYTEST";
    const secretKey = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";

    // Step 1: mandatory fields first, then optional fields
    const fields = {
      total_amount: total_amount.toString(),
      transaction_uuid: transaction_uuid.toString(),
      product_code: product_code.toString(),
      amount: total_amount.toString(),
      tax_amount: "0.00",
      product_service_charge: "0.00",
      product_delivery_charge: "0.00",
      success_url: process.env.SUCCESS_URL || "http://localhost:5173/products",
      failure_url: process.env.FAILURE_URL || "http://localhost:5173/failure-payment",
    };

    // Step 2: generate signed_field_names in exact order of fields
    const signed_field_names = Object.keys(fields).join(",");

    // Step 3: message is concatenation of all values in the same order
    const message = Object.keys(fields)
      .map((key) => fields[key])
      .join(",");

    // Step 4: HMAC SHA256 signature, Base64 encoded
    const signature = CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Base64);

    // Send to frontend
    res.json({ ...fields, signed_field_names, signature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;


