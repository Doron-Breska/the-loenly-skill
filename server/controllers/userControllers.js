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
  const userImg = await imageUpload(req.file, "skills-users");
  const encryptedPassword = await encryptPassword(req.body.password);
  const newUser = new UserModel({
    ...req.body,
    password: encryptedPassword,
    skills: [],
    useImg: userImg,
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
    });
    console.log("registeredUser ----", registeredUser);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      let field = error.keyValue;
      let errorField = Object.keys(field)[0]; // getting the field that caused the error
      res.status(409).json({
        error: `The ${errorField} '${field[errorField]}' is already in use, please try something different`,
      });
    } else {
      res
        .status(500)
        .json({
          error:
            "Something went wrong with your registration - back end controller function ",
        });
    }
  }
};

export { createUser };
