// socket.js
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`, { 
  withCredentials: true,
  autoConnect: false // We'll manually connect after auth
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit('registerUser', userId);
  }
};

export const listenForForceLogout = (callback) => {
  socket.on('forceLogout', (data) => {
    console.log('Received force logout:', data.message);
    callback(data);
  });
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Other socket functions...
export default socket;