import jwt from "jsonwebtoken";
import workspace from "../models/workspace.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error in verifyToken:", error);
    return res.status(403).json({
      message: "Token is invaild",
    });
  }
};

export const requireAdmin = async (req, res, next) => {
  const { workspaceId } = req.params;
  const workspace = await workspace.findById(workspaceId);
  if (workspace.memberRoles.get(req.user.id) !== "admin") {
    return res.status(403).json({
      message: "Admin only",
    });
  }
  next();
};