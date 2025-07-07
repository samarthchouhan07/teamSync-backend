import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);