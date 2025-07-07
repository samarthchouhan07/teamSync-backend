import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createWorkspace,
  joinWorkspace,
  myWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembersOfWorkspace,
  countWorkspace,
  getMembersCount,
  
} from "../controllers/workspaceController.js";
import { createBoard, createList, getBoardsByWorkspace } from "../controllers/boardController.js";
import { createTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/create", verifyToken, createWorkspace);
router.post("/join", verifyToken, joinWorkspace);
router.get("/my", verifyToken, myWorkspace);
router.put("/:id", verifyToken, updateWorkspace);
router.delete("/:id", verifyToken, deleteWorkspace);
router.get("/:workspaceId/boards",verifyToken,getBoardsByWorkspace)
router.post("/:workspaceId/boards",verifyToken,createBoard)
router.post("/boards/:boardId/lists",verifyToken,createList)
router.post("/lists/:listId/tasks",verifyToken,createTask)
router.get("/:id/members",verifyToken,getMembersOfWorkspace)
router.get("/count",verifyToken,countWorkspace)
router.get("/members/count",verifyToken,getMembersCount)

export default router;