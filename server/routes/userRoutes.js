import express from "express";
import {
  blockUser,
  createUser,
  editUser,
  getActiveUser,
  getAllUsers,
  getAllUsersNoFilter,
  login,
  updateUserChats,
} from "../controllers/userControllers.js";
import { multerUpload } from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const userRouter = express.Router();

userRouter.post("/new", multerUpload.single("userImg"), createUser);
userRouter.post("/login", login);
userRouter.get("/active", jwtAuth, getActiveUser);
userRouter.get("/all-users", jwtAuth, getAllUsers);
userRouter.get("/all-users-no-filetr", getAllUsersNoFilter);
userRouter.post("/block", jwtAuth, blockUser);
userRouter.put("/edit", jwtAuth, multerUpload.single("userImg"), editUser);
userRouter.put("/edit-chats", jwtAuth, updateUserChats);

export default userRouter;
