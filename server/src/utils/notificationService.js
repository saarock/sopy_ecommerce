import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { io } from "../app.js";
import connectedUsers from "./connectedUsers.js";

/**
 * Create and send notification to specific user(s)
 * @param {Object} options - Notification options
 * @param {String|Array} options.userId - Single user ID or array of user IDs
 * @param {String} options.message - Notification message
 * @param {String} options.actionType - Type of action
 * @param {String} options.recipientRole - Role of recipient (admin/user/all)
 * @param {Object} options.metadata - Additional metadata
 */
export const createAndSendNotification = async ({
    userId,
    message,
    actionType,
    recipientRole = 'user',
    metadata = {}
}) => {
    try {
        const userIds = Array.isArray(userId) ? userId : [userId];
        const notifications = [];

        for (const uid of userIds) {
            // Create notification in database
            const notification = await Notification.create({
                user: uid,
                message,
                actionType,
                recipientRole,
                metadata
            });

            notifications.push(notification);

            // Send real-time notification via socket
            const socketId = connectedUsers.getUserSocketId(uid);
            if (socketId) {
                io.to(socketId).emit('notification', {
                    notification: notification.toObject(),
                    totalNotifications: await Notification.countDocuments({ 
                        user: uid, 
                        isRead: false 
                    })
                });

                // Also send notification message
                io.to(socketId).emit('notification-message', message);
            }
        }

        return notifications;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

/**
 * Send notification to all admins
 * @param {String} message - Notification message
 * @param {String} actionType - Type of action
 * @param {Object} metadata - Additional metadata
 */
export const notifyAllAdmins = async (message, actionType, metadata = {}) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('_id');
        const adminIds = admins.map(admin => admin._id.toString());

        if (adminIds.length > 0) {
            await createAndSendNotification({
                userId: adminIds,
                message,
                actionType,
                recipientRole: 'admin',
                metadata
            });
        }
    } catch (error) {
        console.error('Error notifying admins:', error);
        throw error;
    }
};

/**
 * Send notification to specific user
 * @param {String} userId - User ID
 * @param {String} message - Notification message
 * @param {String} actionType - Type of action
 * @param {Object} metadata - Additional metadata
 */
export const notifyUser = async (userId, message, actionType, metadata = {}) => {
    try {
        await createAndSendNotification({
            userId,
            message,
            actionType,
            recipientRole: 'user',
            metadata
        });
    } catch (error) {
        console.error('Error notifying user:', error);
        throw error;
    }
};

/**
 * Send notification to all users
 * @param {String} message - Notification message
 * @param {String} actionType - Type of action
 * @param {Object} metadata - Additional metadata
 */
export const notifyAllUsers = async (message, actionType, metadata = {}) => {
    try {
        const users = await User.find({ role: 'user' }).select('_id');
        const userIds = users.map(user => user._id.toString());

        if (userIds.length > 0) {
            await createAndSendNotification({
                userId: userIds,
                message,
                actionType,
                recipientRole: 'all',
                metadata
            });
        }
    } catch (error) {
        console.error('Error notifying all users:', error);
        throw error;
    }
};
