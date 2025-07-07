import express from "express"
import { dashboardTasks, dashboardTeam, getUserDetails, myWorkspaceDashboard } from "../controllers/dashboardController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router=express.Router()

router.get("/tasks",verifyToken,dashboardTasks)
router.get("/team",verifyToken,dashboardTeam)
router.get("/my",verifyToken,myWorkspaceDashboard)
router.get("/:userId",getUserDetails)

export default router