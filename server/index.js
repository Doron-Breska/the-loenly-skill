import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import userRouter from "../server/routes/userRoutes.js"; // Ensure this path is correct
import cloudinaryConfig from "./configs/cloudinary.js";
import { passportConfig } from "./configs/passport.js";
import { createServer } from "http";
import { Server } from "socket.io";

// Import Chat and Message models
import ChatModel from "../server/modals/chatModal.js";
import MessageModel from "../server/modals/messageModal.js";
import msgRouter from "../server/routes/msgRoutes.js";
import UserModal from "./modals/userModal.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Function to connect to MongoDB
const connectMongoose = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }) // Added options for better connection handling
    .then(() => console.log("Connection to MongoDB established"))
    .catch((err) => console.log("MongoDB connection error:", err));
};
connectMongoose();

cloudinaryConfig();
passportConfig();

app.use("/api/users", userRouter);
app.use("/api/msgs", msgRouter);

// Map to store user IDs and their corresponding socket IDs
const users = {};
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
  });

  socket.on("privateMessage", async ({ message, from, to }) => {
    try {
      // Step 1: Find the chat or create a new one
      let chat = await ChatModel.findOne({
        participants: { $all: [from, to] },
        chatType: "one-to-one",
      });

      if (!chat) {
        chat = new ChatModel({
          participants: [from, to],
          chatType: "one-to-one",
        });
        await chat.save();

        // Step 2: Update the users' chat lists with the new chat ID
        await UserModal.findByIdAndUpdate(from, {
          $addToSet: { chats: chat._id },
        });
        await UserModal.findByIdAndUpdate(to, {
          $addToSet: { chats: chat._id },
        });
      }

      // Step 3: Create and save the new message
      const newMessage = new MessageModel({
        sender: from,
        content: message,
        chat: chat._id,
        seen: false,
      });
      await newMessage.save();

      // Add the new message to the chat's messages array
      chat.messages.push(newMessage._id);
      await chat.save();

      // Step 4: Send the message to the recipient if they are online
      const recipientSocketId = users[to];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", {
          from,
          text: message,
        });
        console.log(`Message sent to ${to}`);
      } else {
        console.log(`User ${to} not found`);
      }
    } catch (error) {
      console.error("Error handling private message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

server.listen(port, () => {
  console.log("Server running on port:", port);
});
