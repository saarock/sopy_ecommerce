import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    actionType: {
        type: String,
        enum: [
            'product_created', 'product_updated', 'product_deleted', 'product_availability_changed',
            'order_placed', 'order_status_changed', 'order_cancelled', 'order_cancelled_by_user',
            'user_status_changed', 'user_role_changed',
            'purchase_completed', 'stock_low', 'low_stock_alert'
        ],
        required: true
    },
    recipientRole: {
        type: String,
        enum: ['admin', 'user', 'all'],
        default: 'user'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
