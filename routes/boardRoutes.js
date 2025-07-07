import express from "express"
import { createBoard, getBoardById, updateList, updateTask } from "../controllers/boardController.js"
import { verifyToken } from "../middleware/authMiddleware.js"
import { getListsByBoard } from "../controllers/listController.js"
import { createComment, getCommentsByBoard } from "../controllers/commentController.js"

const router=express.Router()

router.post("/",verifyToken,createBoard)
router.get("/:boardId/lists",verifyToken,getListsByBoard)
router.patch("/list/:id",verifyToken,updateList)
router.patch("/task/:id",verifyToken,updateTask)
router.get("/:boardId/details",verifyToken,getBoardById)
router.post("/:boardId",verifyToken,createComment)
router.get("/:boardId",verifyToken,getCommentsByBoard)

// router.get("/",verifyToken,getBoards)

export default router;