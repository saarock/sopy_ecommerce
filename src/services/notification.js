import protectedApi from "../instance/axiosProtectedInstance.js";

class Notification {
    async getAllNotifications(userId) {
        try {
            const response = await protectedApi.get("/get-notifications", { userId });
            const data = await response.data;
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async changeStatusOfMarkAsReadAndUnRead(notificationId, status) {
        try {
         
            const response = await protectedApi.patch("/change-read-status", {notificationId, status});
            const data = await response.data;
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const notification = new Notification();
export default notification;
