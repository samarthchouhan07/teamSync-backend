import board from "../models/board.js";
import List from "../models/List.js";
import task from "../models/task.js";
import user from "../models/user.js"
import workspace from "../models/workspace.js";

export const getUserDetails = async (req, res) => {
  const { userId } = req.params;
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  // console.log("getuserDetails got hit");

  try {
    const tasks = await task.find({ assignedTo: userId });
    // console.log(tasks);
    const summary = {
      total: tasks.length,
      done: tasks.filter((t) => t.status === "Done").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < today)
        .length,
    };

    const upcoming = tasks
      .filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate) <= nextWeek &&
          new Date(t.dueDate) >= today
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const boards = await board.find({ members: userId }).populate("members");

    // console.log("summary:", summary);
    // console.log("upcoming:", upcoming);
    // console.log("boards:", boards);
    return res.json({
      summary,
      upcoming,
      boards,
    });
  } catch (error) {
    console.log("error in getUserDetails:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const myWorkspaceDashboard = async (req, res) => {
  try {
    const workspaces = await workspace.find({ members: req.user.id });

    const enrichedWorkspaces = await Promise.all(
      workspaces.map(async (ws) => {
        // Find all boards for this workspace
        const boards = await board.find({ workspaceId: ws._id });

        // Get all lists under those boards
        const boardIds = boards.map((b) => b._id);
        const lists = await List.find({ board: { $in: boardIds } });

        // Get all tasks in those lists
        const listIds = lists.map((l) => l._id);
        const tasks = await task.find({ listId: { $in: listIds } });

        // Count tasks
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.isCompleted).length;

        return {
          ...ws.toObject(),
          totalTasks,
          completedTasks,
        };
      })
    );

    // console.log("workspaces in myWorkspaceDashboard:", enrichedWorkspaces);
    return res.json(enrichedWorkspaces);
  } catch (error) {
    console.log("Error in myWorkspaceDashboard:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const dashboardTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await task.find({ assignedTo: userId });
    console.log("tasks in dashboardTasks:", tasks);
    return res.json(tasks);
  } catch (error) {
    console.log("Error in dashboardTasks:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const dashboardTeam = async (req, res) => {
  try {
    const userId = req.user.id;

    const workspaces = await workspace.find({ members: userId });

    const memberIdsSet = new Set();

    workspaces.forEach((ws) => {
      ws.members.forEach((memberId) => {
        if (memberId.toString() !== userId) {
          memberIdsSet.add(memberId.toString());
        }
      });
    });

    const memberIds = [...memberIdsSet];

    const members = await user
      .find({ _id: { $in: memberIds } })
      // .select("username email ");

    console.log("Members in dashboardTeam:",members)
    return res.json(members);
  } catch (error) {
    console.log("Error in dashboardTeam:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
