// // src/contexts/SocketContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";

// const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   useEffect(() => {
//     // Initialize socket connection
//     const newSocket = io(
//       import.meta.env.VITE_API_URL || "http://localhost:5000",
//       {
//       withCredentials: true,
//       }
//     );

//     setSocket(newSocket);

//     // Cleanup on unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   // Listen for online users updates
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("onlineUsers", (users) => {
//       setOnlineUsers(users);
//     });

//     return () => {
//       socket.off("onlineUsers");
//     };
//   }, [socket]);

//   return (
//     <SocketContext.Provider value={{ socket, onlineUsers }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   return useContext(SocketContext);
// };
// context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
