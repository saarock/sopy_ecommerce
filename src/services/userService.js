import api from "../instance/axiosInstance";
import protectedApi from "../instance/axiosProtectedInstance";

class UserService {
  async getAllUsers(usersPerPage, currentPage, search = "") {
    try {
      const response = await protectedApi.get(
        `/get-users?page=${currentPage}&limit=${usersPerPage}&search=${search}`
      );
      const data = await response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  async updateUserStatus(userId, updatedStatus) {
    try {
      const response = await protectedApi.put(`/deactivate-activate-user`, {
        userId,
        updatedStatus,
      });
      const data = await response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  async getNotifications(currentPage, productsPerPage, isRead, userId) {
    try {
      const response = await protectedApi.get(
        `/get-notifications?page=${currentPage}&limit=${productsPerPage}&isRead=${isRead}&userId=${userId}`
      );
      const data = await response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  async getUnreadCount(userId) {
    try {
      const response = await protectedApi.get(
        `/get-notifications?page=1&limit=1&isRead=false&userId=${userId}`
      );
      return response.data.data.totalNotifications || 0;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  }

  async updateUserRole(currentUserId, updatedRole) {
    try {
      const response = await protectedApi.patch(`/update-user-role`, {
        currentUserId,
        updatedRole,
      });
      const data = await response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  forgetPassword = async (email) => {
    try {
      const response = await api.post("/forget-password", { email });
      const data = await response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  resetPassword = async (token, password) => {
    try {
      const response = await api.post("/reset-password", { token, password });
      const data = await response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  subscribe = async (email) => {
    try {
      const response = await api.post("/subscribe", { email });
      const data = await response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  async getAdminStats() {
    try {
      const response = await protectedApi.get("/admin-stats");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch admin stats");
    }
  }

  async getProfile(userId = "") {
    try {
      const response = await protectedApi.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch profile");
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await protectedApi.put("/update-profile", profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update profile");
    }
  }
}

const userService = new UserService();
export default userService;
