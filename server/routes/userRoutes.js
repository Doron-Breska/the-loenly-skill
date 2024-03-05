import express from "express";
import { createUser } from "../controllers/userControllers.js";
import { multerUpload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/new", multerUpload.single("skillsuser"), createUser);

export default userRouter;
