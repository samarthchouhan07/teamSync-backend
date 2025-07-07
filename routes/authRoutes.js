import expres from "express";
import {
  registerUser,
  loginUser,
  getUserSettings,
  updateProfileSettings,
  updatePassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = expres.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:userId", getUserSettings);
router.put("/profile/:userId", verifyToken, updateProfileSettings);
router.put("/password/:userId", verifyToken, updatePassword);

export default router;
