import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      msg: "User registered Successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in registerUserController:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User not found in the database",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    return res.json({ token, user });
  } catch (error) {
    console.log("error in loginUserController:", error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const getUserSettings = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId)
      return res.status(404).json({
        error: "userId not found",
      });
    return res.json(user);
  } catch (error) {
    console.log("error in getUserSettings:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateProfileSettings = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await user.findById(req.params.userId);
    if(user._id!== req.user.id){
      return res.status(403).json({
        error:"Unauthorized"
      })
    }

    const updatedUser = await user
      .findByIdAndUpdate(req.params.userId, { username, email }, { new: true })
      .select("-password");
    return res.status(201).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfileSettings:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user_ = await user.findById(req.params.userId);
    const isMatch = await bcrypt.compare(currentPassword, user_.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect Password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user_.password = hashed;
    await user_.save();
    return res.json({ success: true });
  } catch (error) {
    console.log("error in updatePassword:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
