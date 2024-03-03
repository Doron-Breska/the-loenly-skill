import mongoose from "mongoose";
const { Schema } = mongoose;

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
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SkillModel = mongoose.model("skill", SkillSchema);
