import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Chat, Message } from "../types";
import { useSocket } from "../context/SocketContext";

interface Message2 {
  from: string;
  text: string;
}
const ChatRoom2: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { socket, sendMessage } = useSocket();

  const [activeHistoryChat, setActiveHistoryChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatNames, setChatNames] = useState([]);
  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [messages, setMessages] = useState<Message2[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

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

      setActiveHistoryChat(response.data.chat);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chat:", error);
      setLoading(false);
    }
  };

  const getChatsNmaes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Get the JWT token from local storage
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `http://localhost:5005/api/msgs/get-all`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
          },
        }
      );

      setChatNames(response.data.chats);
      console.log("relsult for getting chatnames", response.data.chats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chat:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getChatsNmaes();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message: Message2) => {
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
      sendMessage({ message, from: user._id, to: activeChat });
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        {chatNames &&
          chatNames.length > 0 &&
          chatNames.map((chat: Chat) => {
            return (
              <div key={chat._id}>
                <h2>{chat.participants[0].username}</h2>
                <button onClick={() => fetchChatById(chat._id)}>
                  Resume Chat
                </button>
                <button
                  onClick={() => {
                    fetchChatById(chat._id);
                    startChat(chat.participants[0]._id);
                    setName(chat.participants[0].username);
                  }}
                >
                  Start Chat
                </button>
              </div>
            );
          })}
      </div>

      {loading && <p>Loading chat...</p>}
      {activeHistoryChat && (
        <div style={{ backgroundColor: "beige" }}>
          <h2>Chat History</h2>
          {activeHistoryChat &&
            activeHistoryChat.messages!.map((msg: Message) => (
              <div key={msg._id}>
                <strong>{msg.sender === user?._id ? "me" : "them"}:</strong>{" "}
                {msg.content}
              </div>
            ))}
        </div>
      )}
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
                <strong>{msg.from === "me" ? "me" : name}:</strong> {msg.text}
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

export default ChatRoom2;
