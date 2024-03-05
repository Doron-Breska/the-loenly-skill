import mongoose from "mongoose";
const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        index: true,
      },
    ],
    chatType: {
      type: String,
      enum: ["one-to-one", "group"],
      required: true,
      index: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "message",
      },
    ],

    ////// when creating the controller function for the chats make sure to initially let the user see X number of msgs per chat + load more btn..
    /////  when building the back end function to fethc the last X chats only and only when the user clikc see older chats to get the older ones.
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("chat", ChatSchema);

export default ChatModel;
