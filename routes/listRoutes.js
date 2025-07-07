import express from "express"
import { createList,deleteList,getListsByBoard, updateList } from "../controllers/listController.js"
import {verifyToken} from "../middleware/authMiddleware.js"

const router=express.Router()

router.post("/",verifyToken,createList)
router.get("/:boardId",verifyToken,getListsByBoard)
router.delete("/:listId",verifyToken,deleteList)
router.patch("/:listId",verifyToken,updateList)

export default router