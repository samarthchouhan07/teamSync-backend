import express from "express";
import { createTask, deleteTask, getTaskCount, getTasksByList, moveTask, updateTask } from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/count",verifyToken,getTaskCount)
router.get("/:listId", verifyToken, getTasksByList);
router.delete("/:taskId",verifyToken,deleteTask)
router.patch("/:taskId",verifyToken,updateTask)
router.patch("/:taskId/move",verifyToken,moveTask)

export default router;