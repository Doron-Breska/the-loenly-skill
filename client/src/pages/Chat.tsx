import React, { useContext, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { User } from "../types";

const Chat = () => {
  const { socket, sendMessage } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ from: string; text: string }[]>(
    []
  );
  const [activeChat, setActiveChat] = useState<User | null>(null);
  const { users } = useContext(AuthContext);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message: { from: string; text: string }) => {
        console.log("Received message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && message.trim() && activeChat) {
      console.log(`Sending message: "${message}" to user: ${activeChat._id}`);
      sendMessage(message, activeChat._id);
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "me", text: message },
      ]);
      setMessage("");
    }
  };

  const startChat = (user: User) => {
    setActiveChat(user);
    setMessages([]); // Clear previous messages when starting a new chat
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h1>Chat Room</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {users ? (
            users.map((singleUser) => (
              <div
                key={singleUser._id}
                style={{
                  border: "2px solid black",
                  marginBottom: "1rem",
                  padding: "1rem",
                }}
              >
                <h2>{singleUser.username}</h2>
                <h2>{singleUser.email}</h2>
                <h2>Latitude: {singleUser.latitude}</h2>
                <h2>Longitude: {singleUser.longitude}</h2>
                <img
                  src={singleUser.userImg[0]} // Assuming userImg is an array and using the first image
                  alt={singleUser.username}
                  style={{ width: "4rem" }}
                />
                <button onClick={() => startChat(singleUser)}>
                  Start Chat
                </button>
              </div>
            ))
          ) : (
            <h2>No users</h2>
          )}
        </div>
      </div>
      {activeChat && (
        <div
          style={{
            marginLeft: "2rem",
            border: "1px solid black",
            padding: "1rem",
          }}
        >
          <h2>Chat with {activeChat.username}</h2>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.from}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
