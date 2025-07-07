import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import boardRoutes from "./routes/boardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspace.js";
import listRoutes from "./routes/listRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import commentRoutes from "./routes/commentRoutes.js"
import dashboardRoutes from "./routes/dashboard.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Team-sync api is running");
}); 
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/comments",commentRoutes)
app.use("/api/dashboard",dashboardRoutes)

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => console.log("error in server.js", err));