import express from "express";
import {
  createChatWithMessage,
  getChatById,
} from "../controllers/msgControllers.js";

// import { multerUpload } from "../middlewares/multer.js"; later for sending imgs
import jwtAuth from "../middlewares/jwtAuth.js";

const msgRouter = express.Router();

msgRouter.post("/new", jwtAuth, createChatWithMessage);
msgRouter.post("/find", jwtAuth, getChatById);

export default msgRouter;
