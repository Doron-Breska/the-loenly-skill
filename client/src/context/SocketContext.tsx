import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { AuthContextType, AuthContext } from "./AuthContext";

interface MessagePayload {
  message: string;
  from: string;
  to: string;
}

interface SocketContextProps {
  socket: Socket | null;
  sendMessage: (payload: MessagePayload) => void;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  sendMessage: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext<AuthContextType>(AuthContext); // Correctly use the AuthContext
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:5005");
      newSocket.emit("register", user._id);
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const sendMessage = (payload: MessagePayload) => {
    if (socket) {
      socket.emit("privateMessage", payload);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
