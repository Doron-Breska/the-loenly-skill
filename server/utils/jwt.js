import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const generateToken = (existingUser) => {
  const payload = {
    sub: existingUser._id, // Make sure this is the correct property name for the user ID
  };
  const options = {
    expiresIn: "7d", // Token will expire in 7 days
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
};

export { generateToken };
