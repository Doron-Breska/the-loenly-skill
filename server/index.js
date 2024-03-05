import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import userRouter from "../server/routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const connectMongoose = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connection to MongoDB established"))

    .catch((err) => console.log(err));
};
connectMongoose();

const connectRoutes = () => {
  app.use("/api/users", userRouter);
};
connectRoutes();

app.listen(port, () => {
  console.log("server running on port:", port);
});
