class ConnectedUsers {
  constructor() {
    this.connectedUsers = new Map();
  }

  addUser(userId, socketId) {
    console.log("Adding user: " + userId)
    this.connectedUsers.set(userId.toString(), socketId);
  }

  removeUser(socketId) {
    for (const [userId, id] of this.connectedUsers.entries()) {
      if (id === socketId) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  getUserSocketId(userId) {
    if (!userId) return null;
    console.log("Getting socket for userID: " + userId)
    return this.connectedUsers.get(userId.toString());
  }
}

export default new ConnectedUsers();
// Usage example in socket server
