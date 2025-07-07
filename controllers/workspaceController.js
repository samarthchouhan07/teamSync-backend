import Workspace from "../models/workspace.js";

export const createWorkspace = async (req, res) => {
  const { name } = req.body;
  const workspace = new Workspace({
    name,
    members: [req.user.id],
    createdBy: req.user.id,
    memberRoles: { [req.user.id]: "admin" },
  });
  await workspace.save();
  console.log(workspace);
  return res.status(201).json(workspace);
};

export const joinWorkspace = async (req, res) => {
  const { workspaceId } = req.body;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace)
    return res.status(404).json({
      message: "Workspace not found",
    });
  if (!workspace.members.includes(req.user.id)) {
    workspace.members.push(req.user.id);
    workspace.memberRoles.set(req.user.id, "member");
    await workspace.save();
  }
  res.json(workspace);
};

export const myWorkspace = async (req, res) => {
  // const userId = req.body.userId;
  // console.log("user:",req.user)
  const workspaces = await Workspace.find({ members: req.user.id });
  console.log("workspaces:", workspaces);
  const withRoles = workspaces.map((w) => ({
    _id: w._id,
    name: w.name,
    role: w.memberRoles.get(req.user.id),
  }));
  console.log("myWorkspace:", withRoles);
  return res.json(withRoles);
};

export const updateWorkspace = async (req, res) => {
  const { name } = req.body;
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace)
    return res.status(404).json({ message: "workspace Not found" });
  if (!workspace.createdBy.equals(req.user.id))
    return res.status(403).json({ message: "unauthorized" });
  workspace.name = name;
  await workspace.save();
  res.json(workspace);
};

export const deleteWorkspace = async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace)
    return res.status(404).json({
      message: "Not found",
    });
  if (!workspace.createdBy.equals(req.user.id))
    return res.status(403).json({
      message: "Unauthorized",
    });
  await workspace.deleteOne();
  res.json({
    message: "Workspace deleted",
  });
};

export const getMembersOfWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate(
      "members",
      "username email_id"
    );
    res.json(workspace.members);
  } catch (error) {
    console.log("Error in getMembersOfWorkspace:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const countWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Workspace.countDocuments({ members: userId });

    return res.status(200).json({ count });
  } catch (error) {
    console.log("Error in countWorkspace:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getMembersCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const workspaces = await Workspace.find({ members: userId }).select(
      "members"
    );

    const allMembers = workspaces.flatMap((w) => w.members.map(String));

    const uniqueMemberIds = [...new Set(allMembers)];

    res.status(200).json({ count: uniqueMemberIds.length });
  } catch (error) {
    console.log("error in getMembersCount:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
