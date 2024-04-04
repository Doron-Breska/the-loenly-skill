import UserModel from "../modals/userModal.js";
import { imageUpload } from "../utils/imageManagement.js";
import { verifyPassword, encryptPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

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

export { createUser, login, getActiveUser };
