import express from "express";
import {
  createChatWithMessage,
  getAllChats,
  getChatById,
} from "../controllers/msgControllers.js";

// import { multerUpload } from "../middlewares/multer.js"; later for sending imgs
import jwtAuth from "../middlewares/jwtAuth.js";

const msgRouter = express.Router();

msgRouter.post("/new", jwtAuth, createChatWithMessage);
msgRouter.post("/find", jwtAuth, getChatById);
msgRouter.get("/get-all", jwtAuth, getAllChats);

export default msgRouter;
