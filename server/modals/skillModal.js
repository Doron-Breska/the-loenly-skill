import mongoose from "mongoose";
const { Schema } = mongoose;

const CategoryEnum = [
  "Software Development",
  "Web Development",
  "App Development",
  "UX/UI Design",
  "Data Science",
  "Mathematics",
  "Economics",
  "Physics",
  "Marketing",
  "Photography",
  "Electronic Music (DJing)",
  "Playing Instruments",
  "Singing",
  "Sound Design",
  "Interior Design",
  "Photoshop",
  "Drawing",
  "Sculpture",
  "Dance",
  "Cooking",
  "Languages",
  "Working Out/Sports",
  "Creative Writing",
  "Script Writing",
];

const SkillSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
      enum: CategoryEnum, // Use the enum for category
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SkillModal = mongoose.model("skill", SkillSchema);
export default SkillModal;
