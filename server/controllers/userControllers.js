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
    !req.body.userType ||
    !req.body.location
  ) {
    return res.status(406).json({ error: "Please fill out all fields" });
  }
  console.log("this is the req.body :", req.body);
  const user_img = await imageUpload(req.file, "skills-users");
  const encryptedPassword = await encryptPassword(req.body.password);
  const newUser = new UserModel({
    ...req.body,
    password: encryptedPassword,
    skills: [],
    user_img: user_img,
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
    console.log("registeredUser ----", registeredUser);
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

export { createUser };
