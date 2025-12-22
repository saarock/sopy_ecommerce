import asyncHandler from "../utils/asyncHandler.js";
import mailOtpStore from "../utils/mailOtpStore.js";
import nodeMailer from "../utils/mailSender.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { generateRandomToken, randomString } from "../utils/randomString.js";
import Subscriber from "../models/subscriber.js";
import { notifyAllAdmins, notifyUser } from "../utils/notificationService.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Error generating access and refresh token: " + error.message
    );
  }
};

/**
 * sends mail to the user to confrim the email
 */
export const sendMailToTheUser = asyncHandler(async (req, res) => {
  console.log("request came");
  const { email } = req.body;
  console.log(email);
  if (!email) {
    throw new ApiError(400, "Mail is required");
  }
  const generateOtp = mailOtpStore.generateOtp();
  const storedOtp = mailOtpStore.storeOtp(email, generateOtp);
  if (!storedOtp) {
    throw new Error("Failed to generate or stored otp");
  }
  const name = email.split("@")[0];
  await nodeMailer.sendOtpEmail({
    otp: storedOtp,
    to: email,
    name,
    purpose: "verification",
  });
  res.status(200).json(new ApiResponse(200, null, "Mail send successfully"));
});

export const verifyUserMail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  
  // Verify OTP
  const isCorrectOtp = mailOtpStore.verifyOtp(email, otp);
  console.log(isCorrectOtp);
  console.log("Main verify");

  if (!isCorrectOtp) {
    throw new ApiError(400, "Wrong otp");
  }

  // OTP verified successfully
  return res.status(200).json(
    new ApiResponse(200, { email }, "OTP verified successfully")
  );
});

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, userName, phoneNumber, email, password, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      throw new ApiError(400, "All field are required");
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { phoneNumber }, { userName }],
    });

    if (existedUser) {
      throw new ApiError(400, "User already exist.");
    }
    console.log("It came up to me");
    

    const user = await User.create({
      fullName,
      email,
      userName,
      phoneNumber,
      password,
      role,
    });

    console.log(user);

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -resetToken -passwordResetExpires -__v "
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "Register Successfull"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while login"
    );
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!(userName || email)) {
      throw new ApiError(400, "UserName or email requried");
    }

    const user = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "Account doesnot exit please register first");
    }

    if (!user.isActive) {
      console.log("deactivate");
      throw new ApiError(
        403,
        "Your Account is Deactivated Pleased contact to our team."
      );
    }

    const passwordCorrect = await user.isPasswordCorrect(password);
    if (!passwordCorrect) {
      throw new ApiError(401, "Incorrect Password.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const {
      password: _,
      refreshToken: __,
      ...userWithoutSensativeData
    } = user.toObject();

    return res.status(201).json(
      new ApiResponse(200, {
        userWithoutSensativeData,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while login"
    );
  }
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token required." });
  }

  try {
    // console.log("yes: " + process.env.REFRESH_TOKEN_SECRET);

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // console.log(decoded);

    const user = await User.findById(decoded._id);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a new access token
    const newAccessToken = await user.generateAccessToken();

    // Send the new access token back in the response
    return res
      .status(201)
      .json(new ApiResponse(200, newAccessToken, "Register Successfull"));
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 4, search = "" } = req.query; // Added search to query params
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {};
    if (search.trim()) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).skip(skip).limit(limitNumber);

    const totalUsers = await User.countDocuments(query); // Update total count based on search results
    const totalPages = Math.ceil(totalUsers / limitNumber);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          users,
          currentPage: pageNumber,
          totalPages,
          totalUsers,
        },
        "Users fetched successfully"
      )
    );
    console.log("user send success");
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching users"
    );
  }
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  try {
    const { userId, updatedStatus } = req.body;
    if (!userId) {
      throw new ApiError(400, "Pleased Provide the userId");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        500,
        error?.message || "Something went wrong while fetching users"
      );
    }

    // if (user.role === "user") {
    //     throw new ApiError(500, "Accessible to Admin");
    // }

    console.log(updatedStatus);
    // user?.isActive = !updatedStatus;
    user.isActive = updatedStatus;

    await user.save();

    // Notify user about status change
    await notifyUser(
      userId,
      `Your account has been ${updatedStatus ? 'activated' : 'deactivated'}.`,
      'user_status_changed',
      { userId, isActive: updatedStatus }
    );

    // Notify admins about status change
    await notifyAllAdmins(
      `User "${user.userName}" has been ${updatedStatus ? 'activated' : 'deactivated'}.`,
      'user_status_changed',
      { userId, userName: user.userName, isActive: updatedStatus }
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user,
        },
        "Users fetched successfully"
      )
    );
    console.log("user send success");
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching users"
    );
  }
});

export const updateUserRole = asyncHandler(async (req, res) => {
  try {
    const { currentUserId, updatedRole } = req.body;
    if (!currentUserId) {
      throw new ApiError(400, "Pleased Provide the currentUserId");
    }

    const user = await User.findById(currentUserId);
    if (!user) {
      throw new ApiError(
        500,
        error?.message || "Something went wrong while fetching users"
      );
    }

    user.role = updatedRole;

    await user.save();

    // Notify user about role change
    await notifyUser(
      currentUserId,
      `Your role has been changed to "${updatedRole}".`,
      'user_role_changed',
      { userId: currentUserId, newRole: updatedRole }
    );

    // Notify admins about role change
    await notifyAllAdmins(
      `User "${user.userName}" role has been changed to "${updatedRole}".`,
      'user_role_changed',
      { userId: currentUserId, userName: user.userName, newRole: updatedRole }
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user,
        },
        "Users fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching users"
    );
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(400, "User not found");
    }
    await User.findByIdAndUpdate(
      userId,
      {
        $set: { refreshToken: undefined },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(new ApiResponse(200, {}, "User logged Out"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while logout"
    );
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || email.trim() === "") {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = generateRandomToken(20);
  await nodeMailer.sendPasswordResetEmail({
    to: email,
    resetUrl: `http://localhost:5173/reset-password?token=${resetToken}`,
    name: user.fullName,
  });
  user.resetToken = resetToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset email sent"));
});

export const resetNewPassowrd = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  console.log(token);

  const user = await User.findOne({
    resetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  user.password = password;
  user.resetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset success"));
});

export const subscribeToNewsLetter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || email.trim() === "") {
    throw new ApiError(400, "Email is required");
  } else {
    const mail = await Subscriber.findOne({ email });
    if (mail) {
      throw new ApiError(400, "Already Subscribed");
    }

    await Subscriber.create({ email });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Subscribed to news letter"));
  }
});

/**
 * Get user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const targetId = userId || req.user?._id;

  if (!targetId) {
    throw new ApiError(400, "User ID is required");
  }

  // If viewing someone else's profile, check if requester is admin
  if (userId && userId !== req.user?._id.toString() && req.user?.role !== "admin") {
    throw new ApiError(403, "Not authorized to view this profile");
  }

  const user = await User.findById(targetId).select(
    "-password -refreshToken -resetToken -passwordResetExpires -__v"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "Profile fetched successfully")
  );
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phoneNumber, location, gender, bio, avatar } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update allowed fields
  if (fullName) user.fullName = fullName;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (location !== undefined) user.location = location;
  if (gender !== undefined) user.gender = gender;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(userId).select(
    "-password -refreshToken -resetToken -passwordResetExpires -__v"
  );

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "Profile updated successfully")
  );
});

