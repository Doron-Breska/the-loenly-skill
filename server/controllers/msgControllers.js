import UserModel from "../modals/userModal.js";
import ChatModal from "../modals/chatModal.js";
import MessageModal from "../modals/messageModal.js";
import mongoose from "mongoose";

const createChatWithMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    const from = req.user._id; /// the sender(the logged in user we have access to from the token)

    // Step 1: Check if a one-on-one chat between the two users already exists
    let chat = await ChatModal.findOne({
      participants: { $all: [from, to] },
      chatType: "one-to-one",
    });

    // Step 2: If the chat exists, simply create and save a new message
    if (chat) {
      const newMessage = new MessageModal({
        sender: from,
        content: message,
        chat: chat._id,
        seen: false, // Initially, the message is unseen by the receiver
      });
      await newMessage.save();

      // Add the new message to the chat's messages array
      chat.messages.push(newMessage._id);
      await chat.save();

      return res.status(201).json({
        status: "Success",
        chat,
        message: newMessage,
      });
    }

    // Step 3: If no chat exists, create a new chat document
    chat = new ChatModal({
      participants: [from, to],
      chatType: "one-to-one",
      messages: [],
    });
    await chat.save();

    // Step 4: Create and save the first message for the new chat
    const firstMessage = new MessageModal({
      sender: from,
      content: message,
      chat: chat._id,
      seen: false, // Initially, the message is unseen by the receiver
    });
    await firstMessage.save();

    // Add the first message to the chat's messages array
    chat.messages.push(firstMessage._id);
    await chat.save();

    // Step 5: Update the users' chat lists
    await UserModel.findByIdAndUpdate(from, { $addToSet: { chats: chat._id } });
    await UserModel.findByIdAndUpdate(to, { $addToSet: { chats: chat._id } });

    // Step 6: Return the newly created chat and message
    res.status(201).json({
      status: "Success",
      chat,
      message: firstMessage,
    });
  } catch (error) {
    console.error("Error creating chat with message:", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};

export default createChatWithMessage;
