import UserModel from "../modals/userModal.js";
import { imageUpload } from "../utils/imageManagement.js";
import { verifyPassword, encryptPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";

const createUser = async (req, res) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.username ||
    !req.body.age ||
    !req.body.bio ||
    !req.body.sex ||
    !req.body.latitude ||
    !req.body.longitude
  ) {
    return res.status(406).json({ error: "Please fill out all fields" });
  }
  console.log("this is the req.body :", req.body);
  const userImg = await imageUpload(req.file, "skills-users");
  const encryptedPassword = await encryptPassword(req.body.password);
  const newUser = new UserModel({
    ...req.body,
    latitude: Number(req.body.latitude),
    longitude: Number(req.body.longitude),
    userType: "Regular",
    password: encryptedPassword,
    skills: [],
    userImg: userImg,
    hasMet: [],
    feedback: [],
    chats: [],
    blockedByUsers: [],
    blockedUsers: [],
    verified: false,
    isBanned: false,
    reportCounter: 0,
  });

  try {
    const registeredUser = await newUser.save();
    res.status(200).json({
      msg: "Successfully registered!",
      user: newUser,
    });
    // console.log("registeredUser ----", registeredUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      res.status(400).json({ errors: messages });
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res
        .status(409)
        .json({ error: `An account with that ${field} already exists.` });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};

const login = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (!existingUser) {
      return res.status(404).json({ error: "No user found" });
    }
    const verified = await verifyPassword(
      req.body.password,
      existingUser.password
    );

    if (!verified) {
      return res.status(406).json({ error: "Password doesn't match" });
    }
    const token = generateToken(existingUser);

    res.status(200).json({
      verified: true,
      token: token,
      user: {
        _id: existingUser._id,
        userType: existingUser.userType,
        verified: existingUser.verified,
        // isBanned: existingUser.isBanned,
        blockedUsers: existingUser.blockedUsers,
        blockedByUsers: existingUser.blockedByUsers,
        // reportCounter: existingUser.reportCounter,
        email: existingUser.email,
        latitude: existingUser.latitude,
        longitude: existingUser.longitude,
        username: existingUser.username,
        age: existingUser.age,
        userImg: existingUser.userImg,
        bio: existingUser.bio,
        skills: existingUser.skills,
        sex: existingUser.sex,
        feedback: existingUser.feedback,
        chats: existingUser.chats,
        hasMet: existingUser.hasMet,
      },
    });
  } catch (error) {
    console.log(e);
    res.status(500).json({
      error: "something went wrong with logging you in - back end function",
    });
  }
};

const getActiveUser = async (req, res) => {
  try {
    const user = req.user; // Access the user object from req.user cause in passport.js i get the whole user object
    res.status(200).json({
      status: "Success",
      activeUser: {
        _id: user._id,
        userType: user.userType,
        verified: user.verified,
        // isBanned: existingUser.isBanned,
        blockedUsers: user.blockedUsers,
        blockedByUsers: user.blockedByUsers,
        // reportCounter: existingUser.reportCounter,
        email: user.email,
        latitude: user.latitude,
        longitude: user.longitude,
        username: user.username,
        age: user.age,
        userImg: user.userImg,
        bio: user.bio,
        skills: user.skills,
        sex: user.sex,
        feedback: user.feedback,
        chats: user.chats,
        hasMet: user.hasMet,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const { blockedUsers, blockedByUsers } = req.user;

    // Combine the IDs to exclude: the current user, users they've blocked, and users who have blocked them.
    const excludeIds = [
      currentUserId,
      ...(blockedUsers || []), // Ensure arrays are provided, defaulting to empty if not present
      ...(blockedByUsers || []),
    ];

    // Fetch all users excluding those in the excludeIds array
    const users = await UserModel.find({
      _id: { $nin: excludeIds }, // Use $nin to exclude all IDs in the array
    }).lean();

    res.status(200).json({ status: "Success", users: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getAllUsersNoFilter = async (req, res) => {
  try {
    const users = await UserModel.find().lean();

    res.status(200).json({ status: "Success", users: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const blockUser = async (req, res) => {
  console.log("Request body:", req.body);
  const currentUserId = req.user._id; // ID of the current user
  const { userIdToBlock } = req.body; // ID of the user to block, passed via URL parameter

  if (!mongoose.Types.ObjectId.isValid(userIdToBlock)) {
    return res.status(400).json({ message: "Invalid user ID to block" });
  }

  if (currentUserId === userIdToBlock) {
    return res.status(400).json({ message: "Cannot block oneself" });
  }

  try {
    // Perform a transaction to ensure both operations are successful
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Add userIdToBlock to the current user's blockedUsers array
      const blockerUpdate = await UserModel.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { blockedUsers: userIdToBlock } },
        { new: true, session }
      );

      // Add currentUserId to the blocked user's blockedByUsers array
      const blockedUpdate = await UserModel.findByIdAndUpdate(
        userIdToBlock,
        { $addToSet: { blockedByUsers: currentUserId } },
        { new: true, session }
      );

      if (!blockerUpdate || !blockedUpdate) {
        throw new Error("Update failed");
      }

      // If both operations are successful, commit the transaction
      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ message: "User successfully blocked" });
    } catch (error) {
      // If there's an error during the transaction, abort it
      await session.abortTransaction();
      session.endSession();
      res
        .status(500)
        .json({ message: "Failed to block user", error: error.message });
    }
  } catch (error) {
    console.error("Error blocking user: ", error);
    res
      .status(500)
      .json({ message: "Failed to block user", error: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const user = req.user; // Access the user object from req.user

    // Check for fields in the request body and compare with current user object
    const updates = {};

    if (req.body.email && req.body.email !== user.email) {
      updates.email = req.body.email;
    }
    if (req.body.username && req.body.username !== user.username) {
      updates.username = req.body.username;
    }
    if (req.body.bio && req.body.bio !== user.bio) {
      updates.bio = req.body.bio;
    }
    if (req.body.sex && req.body.sex !== user.sex) {
      updates.sex = req.body.sex;
    }
    if (req.body.latitude && Number(req.body.latitude) !== user.latitude) {
      updates.latitude = Number(req.body.latitude);
    }
    if (req.body.longitude && Number(req.body.longitude) !== user.longitude) {
      updates.longitude = Number(req.body.longitude);
    }
    if (req.body.password) {
      const encryptedPassword = await encryptPassword(req.body.password);
      updates.password = encryptedPassword;
    }
    if (
      req.body.skills &&
      JSON.stringify(req.body.skills) !== JSON.stringify(user.skills)
    ) {
      updates.skills = req.body.skills;
    }
    if (
      req.body.feedback &&
      JSON.stringify(req.body.feedback) !== JSON.stringify(user.feedback)
    ) {
      updates.feedback = req.body.feedback;
    }
    if (
      req.body.chats &&
      JSON.stringify(req.body.chats) !== JSON.stringify(user.chats)
    ) {
      updates.chats = req.body.chats;
    }
    if (
      req.body.hasMet &&
      JSON.stringify(req.body.hasMet) !== JSON.stringify(user.hasMet)
    ) {
      updates.hasMet = req.body.hasMet;
    }

    if (req.file) {
      const userImg = await imageUpload(req.file, "skills-users");
      updates.userImg = userImg;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "No updates provided or values are the same" });
    }

    // Update user object in database
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "Success",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};
const updateUserChats = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const senderId = req.user._id;

    // Fetch the sender and recipient from the database
    const sender = await UserModel.findById(senderId);
    const recipient = await UserModel.findById(otherUserId);

    if (!sender || !recipient) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    // Check if the otherUserId is already in the sender's chats
    let senderHasChat = sender.chats.some(
      (chatArray) => Array.isArray(chatArray) && chatArray.includes(otherUserId)
    );

    if (!senderHasChat) {
      sender.chats.push([otherUserId]);
      await sender.save();
    }

    // Check if the senderId is already in the recipient's chats
    let recipientHasChat = recipient.chats.some(
      (chatArray) => Array.isArray(chatArray) && chatArray.includes(senderId)
    );

    if (!recipientHasChat) {
      recipient.chats.push([senderId]);
      await recipient.save();
    }

    res.status(200).json({
      status: "Success",
      message: "Chats updated successfully",
      updatedSender: sender,
      updatedRecipient: recipient,
    });
  } catch (error) {
    console.error("Error updating user chats:", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};

export {
  createUser,
  login,
  getActiveUser,
  getAllUsers,
  getAllUsersNoFilter,
  blockUser,
  editUser,
  updateUserChats,
};
