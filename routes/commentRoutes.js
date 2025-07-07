import express from "express"
import { createComment, getCommentsByBoard } from "../controllers/commentController.js"
import {verifyToken} from "../middleware/authMiddleware.js"


const router=express.Router()

router.post("/:boardId",verifyToken,createComment)
router.get("/:boardId",verifyToken,getCommentsByBoard)

export default router