import Comment from "../models/comments.js";

export const createComment = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { text } = req.body;
    console.log("boardId:",boardId)

    const comment = await Comment.create({
      boardId,
      author: req.user.id,
      text,
    });
    return res.status(201).json(comment);
  } catch (error) {
    console.log("Error in createComment", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getCommentsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const comments = await Comment.find({ boardId })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    return res.status(200).json(comments);
  } catch (error) {
    console.log("error in getCommentsbyTask:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};