
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    console.log("user is valid");

    
    const token = req.headers.authorization?.split(" ")[1];
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!jwtSecret || !token) {
      throw new ApiError(401, "Unauthorized request");
    }

    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err || !decoded) {
        throw new ApiError(401, "Invalid or expired token");
      }

      const user = await User.findById(decoded._id).select("-password -refreshToken");
      if (!user) {
        return res.status(404).json({ message: "Invalid User" });
      }

      if (!user.isActive) {
        return res
          .status(403)
          .json({ message: "You are blocked pleased logout and contact us!" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    throw new ApiError(500, error?.message || "You are blocked");
  }
});
