import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import userRouter from "../server/routes/userRoutes.js";
import cloudinaryConfig from "./configs/cloudinary.js";
import { passportConfig } from "./configs/passport.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
const connectMongoose = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connection to MongoDB established"))
    .catch((err) => console.log(err));
};
connectMongoose();

cloudinaryConfig();
passportConfig();

// Define routes
const connectRoutes = () => {
  app.use("/api/users", userRouter);
};
connectRoutes();

// Store users and their socket IDs
const users = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
  });

  socket.on("privateMessage", ({ message, to }) => {
    const recipientSocketId = users[to];
    console.log(`Private message from ${socket.id} to ${to}: ${message}`);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", {
        from: socket.id,
        text: message,
      });
      console.log(`Message sent to ${to}`);
    } else {
      console.log(`User ${to} not found`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Remove user from the users object
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log("Server running on port:", port);
});
