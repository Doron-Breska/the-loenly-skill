import express from "express";
import {
  createUser,
  getActiveUser,
  login,
} from "../controllers/userControllers.js";
import { multerUpload } from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const userRouter = express.Router();

userRouter.post("/new", multerUpload.single("userImg"), createUser);
userRouter.post("/login", login);
userRouter.get("/active", jwtAuth, getActiveUser);

export default userRouter;
