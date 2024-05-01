const { Notification, User } = require("../../../models/index");

module.exports = {
  index: async (req, res) => {},
  find: async (req, res) => {},
  store: async (req, res) => {},
  update: async (req, res) => {},
  delete: async (req, res) => {},
  markAsRead: async (req, res) => {
    const { user_id } = req.body;
    const response = {};
    try {
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      await Notification.update(
        { status: "read" },
        {
          where: { user_id: user_id, status: "unread" },
        }
      );
      Object.assign(response, {
        status: 200,
        message: "Success",
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Sever error",
      });
    }
    res.status(response.status).json(response);
  },
  clickNotify: async (req, res) => {
    const { user_id } = req.body;
    const response = {};
    try {
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      await Notification.update(
        { onClick: true },
        {
          where: { user_id: user_id },
        }
      );
      Object.assign(response, {
        status: 200,
        message: "Success",
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Sever error",
      });
    }
    res.status(response.status).json(response);
  },
};
