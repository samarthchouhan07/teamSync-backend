import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    memberRoles: {
      type: Map,
      of: String,
      default: {},
    },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Workspace", workspaceSchema);
