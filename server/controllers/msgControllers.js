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
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.body;
    let chat = await ChatModal.findById(chatId).populate({ path: "messages" });
    if (chat) {
      return res.status(201).json({
        status: "Success",
        chat: chat,
      });
    } else {
      return res
        .status(404)
        .json({ status: "Error", message: "Chat not found" });
    }
  } catch (error) {
    console.error("Somthing went wrong", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};

const getAllChats = async (req, res) => {
  try {
    // Find the user and populate their chats
    const user = await UserModel.findById(req.user._id)
      .populate({
        path: "chats",
        select: ["participants", "createdAt", "updatedAt"],
        populate: {
          path: "participants",
          select: "username _id", // Select username and _id of participants
        },
      })
      .lean();

    // Check if the user has any chats
    if (user.chats && user.chats.length > 0) {
      // Filter out the logged-in user from the participants in each chat
      const chats = user.chats.map((chat) => {
        // Remove the logged-in user from the participants array
        const otherParticipants = chat.participants.filter(
          (participant) =>
            participant._id.toString() !== req.user._id.toString()
        );

        // Return the chat with filtered participants
        return {
          ...chat,
          participants: otherParticipants,
        };
      });

      return res.status(200).json({
        status: "Success",
        chats: chats,
      });
    } else {
      return res.status(404).json({
        status: "Error",
        message: "No chats found",
      });
    }
  } catch (error) {
    console.error("Something went wrong", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
};

export { createChatWithMessage, getChatById, getAllChats };
