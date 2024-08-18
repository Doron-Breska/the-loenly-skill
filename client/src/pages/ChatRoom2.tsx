import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Chat, Message } from "../types";

const ChatRoom2: React.FC = () => {
  const { user, fetchActiveUser } = useContext(AuthContext);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchChatById = async (chatId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Get the JWT token from local storage
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `http://localhost:5005/api/msgs/find`,
        { chatId }, // Pass the chatId in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
          },
        }
      );

      setActiveChat(response.data.chat);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chat:", error);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h1>Chat Room</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {user?.chats &&
            user.chats.length > 0 &&
            user.chats.map((chat) => {
              const chatPartner = chat.participants.find(
                (participant) => participant._id !== user._id
              );

              return (
                <div
                  key={chat._id}
                  style={{
                    border: "2px solid black",
                    marginBottom: "1rem",
                    padding: "1rem",
                  }}
                >
                  <h2>Chat with {chatPartner?.username}</h2>
                  <button onClick={() => fetchChatById(chat._id)}>
                    Resume Chat
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      {loading && <p>Loading chat...</p>}
      {activeChat && (
        <div
          style={{
            marginLeft: "2rem",
            border: "1px solid black",
            padding: "1rem",
          }}
        >
          <h2>Chat History</h2>
          <div>
            {activeChat.messages.map((msg: Message) => (
              <div key={msg._id}>
                <strong>{msg.sender === user?._id ? "me" : "them"}:</strong>{" "}
                {msg.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom2;
