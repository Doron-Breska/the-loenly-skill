import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { AuthContext } from "./AuthContext";

interface SocketContextProps {
  socket: Socket | null;
  sendMessage: (message: string, recipientId: string) => void;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  sendMessage: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);

  const [socket, setSocket] = useState<Socket | null>(null);
  const userId = user?._id; // Replace with actual user ID logic

  useEffect(() => {
    if (!userId) return;
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Register the user with the server
    newSocket.emit("register", userId);
    console.log(`User ${userId} registered with socket server`);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const sendMessage = (message: string, recipientId: string) => {
    if (socket) {
      console.log(`Sending message: "${message}" to user: ${recipientId}`);
      socket.emit("privateMessage", { message, to: recipientId });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
