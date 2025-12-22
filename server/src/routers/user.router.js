import express from "express";
import {
  getAllUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetNewPassowrd,
  resetPassword,
  sendMailToTheUser,
  subscribeToNewsLetter,
  updateUserRole,
  updateUserStatus,
  verifyUserMail,
  getProfile,
  updateProfile,
} from "../controller/user.controller.js";
// import connectedUsers from "../utils/connectedUsers.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/send_mail", sendMailToTheUser);
router.post("/mail_verify", verifyUserMail);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.get("/get-users", verifyJWT, getAllUsers);
router.put("/deactivate-activate-user", verifyJWT, updateUserStatus);
router.patch("/update-user-role", verifyJWT, updateUserRole);
router.post("/logout", verifyJWT, logoutUser);
router.post("/forget-password", resetPassword);
router.post("/reset-password", resetNewPassowrd)
router.post("/subscribe", subscribeToNewsLetter);
router.get("/profile/:userId?", verifyJWT, getProfile);
router.put("/update-profile", verifyJWT, updateProfile);


// first manage this things and do all the stup
router.post("/verifyToken", verifyJWT, async (req, res) => {
  try {
    // const { totalNotifications, _id } = req.user;
    // if (io && parseInt(totalNotifications) > 0) {
    //     const userSocketId = connectedUsers.getUserSocketId(_id);
    //     console.log(userSocketId + " user socket id ")
    //     io.to(userSocketId).emit("notification", { totalNotifications });
    // }

    const userData = await User.findById(req.user._id)
      .select("-password -__v -refreshToken")
      .exec();

    if (!userData) {
      throw new Error("User not found");
    }
    return res.status(201).json(
      new ApiResponse(
        200,
        {
          userData,
        },
        "Verified"
      )
    );
  } catch (eror) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while login"
    );
  }
});

export default router;
