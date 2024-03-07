import express from "express";
import { createUser, login } from "../controllers/userControllers.js";
import { multerUpload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/new", multerUpload.single("user_img"), createUser);
userRouter.post("/login", login);

export default userRouter;
