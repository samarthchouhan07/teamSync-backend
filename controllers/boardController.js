import Board from "../models/board.js";
import List from "../models/List.js";
import task from "../models/task.js";

export const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const { workspaceId } = req.params;
    const board = new Board({ name, workspaceId });
    await board.save();
    return res.status(201).json(board);
  } catch (error) {
    console.log("Error in createBoard:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getBoardsByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    console.log("workspaceId", workspaceId);

    const boards = await Board.find({ workspaceId });
    console.log("boards:", boards);
    return res.status(200).json({ boards });
  } catch (error) {
    console.log("error in getBoardsByWorkspace:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const createList = async (req, res) => {
  try {
    const { title } = req.body;
    const { boardId } = req.params;

    const list = new List({ title, board: boardId });
    await list.save();

    return res.status(201).json(list);
  } catch (error) {
    console.error("Error in createList:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateList = async (req, res) => {
  try {
    const { title } = req.body;
    const updatedList = await List.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    res.status(200).json(updatedList);
  } catch (error) {
    console.log("Error in updateList:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { content } = req.body;
    const updatedTask = await task.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    console.log("Error in updateTask:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ error: "Board not found" });
    res.status(200).json(board);
  } catch (error) {
    console.log("Error in getBoardById:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};