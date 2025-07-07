import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    workspaceId:{type:mongoose.Schema.Types.ObjectId,ref:"Workspace"}
  },
  {
    timestamps: true,
  }
);
 
export default mongoose.model("Board", boardSchema); 