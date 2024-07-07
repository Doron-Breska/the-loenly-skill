// src/components/ChatRoom.tsx
import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

const Chat = () => {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
