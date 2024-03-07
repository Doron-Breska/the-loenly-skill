import mongoose from "mongoose";
const { Schema } = mongoose;
import validator from "validator";

const UserSchema = new Schema(
  {
    userType: {
      type: String,
      enum: ["regular", "premium", "admin"],
      required: true,
      default: "regular",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    reportCounter: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please fill a valid email address"],
      unique: true,
      index: true,
    },
    //////////// must have gps to sign up - to look for dynamic location services
    coordinates: {
      type: [Number], // array of numbers for [longitude, latitude]
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Must be at least 18 years old"],
      max: [120, "Must be less than 120 years old"],
    },
    password: {
      type: String,
      required: true,
    },
    user_img: {
      type: [String],
      default: [
        "https://res.cloudinary.com/danq3q4qv/image/upload/v1683035195/avatars/default-profile-picture-avatar-photo-placeholder-vector-illustration-700-205664584_z4jvlo.jpg",
      ],
    },
    bio: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Regular expression to match disallowed words
          var disallowedWordsRegex = /bitch|slut|anotherBadWord/i;
          // The test returns true if any disallowed word is found, so we negate it
          return !disallowedWordsRegex.test(v);
        },
        message: () =>
          `The bio contains disallowed content. Please revise your bio.`,
      },
    },
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "skill",
      },
    ],
    sex: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Non-Binary",
        "Transgender",
        "Intersex",
        "Prefer Not to Say",
        "Other",
      ],
      required: true,
    },
    feedback: [
      {
        fromUser: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        quote: String,
      },
    ],
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "chat",
      },
    ],
    hasMet: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const UserModal = mongoose.model("user", UserSchema);
export default UserModal;
