import Notification from "../models/notification.model.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const changeNotificationStatus = asyncHandler(async (req, res) => {
    const { notificationId,status } = req.body;
    const notification = await Notification.findById(notificationId);
    console.log(notification + " this is the notification " + status)
    if (!notification) {
        return res.status(400).json({ message: "No notification id. Notification id is required" });
    }

    notification.isRead = parseInt(status) === 0 ? false : true;
    await notification.save();
    // Return the aggregated data

    return res.status(200).json(new ApiResponse(200, null, "status change successfully"));

});



export const getNotifications = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 4, isRead = false, userId } = req.query; // Default to page 1 and 4 items per page

    const limitNumber = parseInt(limit);
    const pageNumber = parseInt(page);
    const skip = (pageNumber - 1) * limitNumber; // Corrected skip calculation

    const filter = { user: userId, isRead: isRead };

    // Fetch notifications with pagination
    const notifications = await Notification.find(filter)
      .skip(skip)
      .limit(limitNumber);

    console.log(notifications);

    if (notifications.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            notifications,
            "There are no notifications for you."
          )
        );
    }

    // Get total count of notifications for pagination
    const totalNotifications = await Notification.countDocuments(filter); // Awaiting countDocuments

    const totalPages = Math.ceil(totalNotifications / limitNumber); // Calculate total pages

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          notifications,
          currentPage: pageNumber,
          totalPages,
          totalNotifications,
        },
        "Your notifications."
      )
    );
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Something went wrong."));
  }
});
