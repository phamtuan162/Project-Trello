const { Activity, User, Workspace } = require("../../../models/index");

module.exports = {
  index: async (req, res) => {},
  find: async (req, res) => {},
  store: async (req, res) => {
    const { user_id, action, workspace_id, board_id, column_id, card_id } =
      req.body;
    const response = {};
    const actions = ["create", "update", "move", "copy"];
    try {
      if (
        !action ||
        !user_id ||
        !workspace_id ||
        (!board_id && !column_id && !card_id)
      ) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }

      if (!actions.includes(action.toLowerCase().trim())) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }

      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      const workspace = await Workspace.findByPk(workspace_id);
      if (!workspace) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      const activity = await Activity.create({
        ...req.body,
        userName: user.name,
        userAvatar: user.avatar,
      });

      Object.assign(response, {
        status: 200,
        message: "Success",
        data: activity,
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Sever error",
      });
    }
    res.status(response.status).json(response);
  },
  update: async (req, res) => {},
  delete: async (req, res) => {},
};
