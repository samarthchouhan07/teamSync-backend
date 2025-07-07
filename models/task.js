import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    listId: { type: mongoose.Schema.Types.ObjectId, ref: "List" },
    position: { type: Number },
    dueDate: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isCompleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    assignedToUsername: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);