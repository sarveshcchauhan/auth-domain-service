import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);