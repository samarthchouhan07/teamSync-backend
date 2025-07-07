import List from "../models/List.js";
import task from "../models/task.js";

export const createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    const newList = await List.create({
      title,
      board: boardId,
    });
    console.log(newList);

    return res.status(201).json({ list: newList });
  } catch (error) {
    console.log("error in createList:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getListsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const lists = await List.find({ board: boardId }).lean();

    for (let list of lists) {
      list.tasks = await task.find({ listId: list._id }).sort({ position: 1 });
    }
    return res.status(200).json(lists);
  } catch (error) {
    console.log("Error in getListsbyBoard:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteList = async (req, res) => {
  try {
    const listId=req.params.listId
    await List.findByIdAndDelete(listId);
    await task.deleteMany({listId})
    res.status(200).json({ message: "List deleted" });
  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateList = async (req, res) => {
  try {
    const { title } = req.body;
    const updatedList = await List.findByIdAndUpdate(
      req.params.listId,
      { title },
      { new: true }
    );
    return res.status(200).json(updatedList);
  } catch (error) {
    console.log("error in updateList:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
