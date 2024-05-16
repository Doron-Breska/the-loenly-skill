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

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for sendMessage events from clients
  socket.on("sendMessage", (message) => {
    // Emit the message to all connected clients
    io.emit("receiveMessage", message);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(port, () => {
  console.log("Server running on port:", port);
});
