import React, { useContext, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

interface Message {
  from: string;
  text: string;
}

const ChatRoom: React.FC = () => {
  const { socket, sendMessage } = useSocket();
  const { user, users } = useContext(AuthContext);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message: Message) => {
        console.log("Received message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim() && activeChat && user) {
      console.log(`Sending message: "${message}" to user: ${activeChat}`);
      sendMessage({ message, from: user.username, to: activeChat });
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "me", text: message },
      ]);
      setMessage("");
    }
  };

  const startChat = (userId: string) => {
    setActiveChat(userId);
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
                <button onClick={() => startChat(singleUser._id)}>
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
          <h2>Chat</h2>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.from === "me" ? "me" : msg.from}:</strong>{" "}
                {msg.text}
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

export default ChatRoom;
