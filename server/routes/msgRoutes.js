import express from "express";
import createChatWithMessage from "../controllers/msgControllers.js";

// import { multerUpload } from "../middlewares/multer.js"; later for sending imgs
import jwtAuth from "../middlewares/jwtAuth.js";

const msgRouter = express.Router();

msgRouter.post("/new", jwtAuth, createChatWithMessage);

export default msgRouter;
