const { Attachment } = require("../../../models/index");
const path = require("path");

module.exports = {
  index: async (req, res) => {},
  find: async (req, res) => {},
  uploads: async (req, res) => {
    const { id } = req.params;
    const user = req.user.dataValues;
    const file = req.file;
    const path = `http://localhost:3001/uploads/${file.filename}`;
    const response = {};
    try {
      const attachment = await Attachment.create({
        user_id: user.id,
        path: id,
        card_id: req.card_id,
        fileName: file.filename,
      });

      Object.assign(response, {
        status: 200,
        message: "Success",
        user: attachment,
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
      });
    }
    res.status(response.status).json(response);
  },

  downloadFile: async (req, res) => {
    const { id } = req.params;
    const attachment = await Attachment.findByPk(id);
    if (!attachment) {
      return next(new Error("No attachment found"));
    }
    const filePath =
      "public" + attachment.path.slice(attachment.path.indexOf("/uploads"));
    res.download(filePath);
  },
  update: async (req, res) => {},
  delete: async (req, res) => {},
};
