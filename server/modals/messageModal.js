import mongoose from "mongoose";
const { Schema } = mongoose;

// Message Schema
const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },
    seen: { type: Boolean },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("message", MessageSchema);

export default MessageModel;
