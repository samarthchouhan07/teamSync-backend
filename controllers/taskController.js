import task from "../models/task.js";
import Task from "../models/task.js";
import user from "../models/user.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const existingTasks = await Task.find({ listId: req.params.listId });

    const task = await Task.create({
      title,
      description,
      listId: req.params.listId,
      position: existingTasks.length,
      dueDate,
      status,
    });
    await task.save();
    return res.status(201).json({ task });
  } catch (error) {
    console.log("error in createTask:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getTasksByList = async (req, res) => {
  try {
    const { listId } = req.params;

    const tasks = await Task.find({ listId })
      .sort("position")
      .populate("assignedTo", "username");
    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getTasksByList:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, isCompleted, status } =
      req.body;
    let assignedToUsername=""
    if(assignedTo){
      const user_=await user.findById(assignedTo)
      assignedToUsername=user_.username
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, dueDate, assignedTo, isCompleted, status ,assignedToUsername},
      { new: true }
    ).populate("assignedTo","username")
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.log("error in updateTask:", error);
    return res.status(500).json({
      error: "internal server error",
    });
  }
};

export const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { toListId, position, reorderedTaskIds } = req.body;

    const task = await Task.findById(taskId);
    if (!task)
      return res.status(404).json({
        error: "Task not found",
      });

    task.listId = toListId;
    await task.save();

    for (let i = 0; i < reorderedTaskIds.length; i++) {
      await Task.findByIdAndUpdate(reorderedTaskIds[i], { position: i });
    }

    return res.status(200).json({
      message: " Task moved and reordered",
    });
  } catch (error) {
    console.log("Error in moveTask:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getTaskCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Task.countDocuments({ assignedTo: userId });
    return res.json({ count });
  } catch (error) {
    console.log("Error in getTaskCount:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};