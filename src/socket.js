import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const URL = API_URL.split('/api')[0];

console.log("Connecting to socket at:", URL);

export const socket = io(URL, {
  autoConnect: true,
  transports: ['websocket', 'polling']
});
