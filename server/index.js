import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const connectMongoose = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() =>
      console.log(
        "Connection to MongoDB established, and server is running on port " +
          port
      )
    )

    .catch((err) => console.log(err));
};
connectMongoose();

app.listen(port, () => {
  console.log("server running on port:", port);
});
