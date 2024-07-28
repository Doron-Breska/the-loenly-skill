import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import userRouter from "../server/routes/userRoutes.js"; // Ensure this path is correct
import cloudinaryConfig from "./configs/cloudinary.js";
import { passportConfig } from "./configs/passport.js";
import { createServer } from "http";
import { Server } from "socket.io";

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

// Map to store user IDs and their corresponding socket IDs
const users = {};
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
  });

  socket.on("privateMessage", ({ message, from, to }) => {
    const recipientSocketId = users[to];
    console.log(`Private message from ${from} to ${to}: ${message}`);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", {
        from,
        text: message,
      });
      console.log(`Message sent to ${to}`);
    } else {
      console.log(`User ${to} not found`);
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
