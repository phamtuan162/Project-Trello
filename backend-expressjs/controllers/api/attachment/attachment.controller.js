const { Attachment, Card, Activity } = require("../../../models/index");
const { object, string } = require("yup");
const fs = require("fs");

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
        path: path,
        card_id: id,
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
  update: async (req, res) => {
    const { id } = req.params;

    const rules = {};

    if (req.body.name) {
      rules.name = string().required("Chưa nhập tên file");
    }
    const schema = object(rules);
    const response = {};
    const attachment = await Attachment.findByPk(id);
    if (!attachment) {
      return res.status(404).json({ status: 404, message: "Not found" });
    }
    try {
      let body = await schema.validate(req.body, {
        abortEarly: false,
      });
      await attachment.update(body);
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: attachment,
      });
    } catch (error) {
      const errors = Object.fromEntries(
        e?.inner.map(({ path, message }) => [path, message])
      );
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        errors,
      });
    }
    res.status(response.status).json(response);
  },
  delete: async (req, res) => {
    const user = req.user.dataValues;
    const { id } = req.params;
    const response = {};
    const attachment = await Attachment.findByPk(id);
    const card = await Card.findByPk(attachment.card_id);

    if (!attachment || !card) {
      return res.status(404).json({ status: 404, message: "Not found" });
    }

    try {
      const fileName = attachment.fileName;
      const filePathOld =
        "public" + attachment.path.slice(attachment.path.indexOf("/uploads"));
      await attachment.destroy();

      if (fs.existsSync(filePathOld)) {
        fs.unlinkSync(filePathOld);
      }

      const activity = await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        card_id: card.id,
        title: card.title,
        action: "delete_file",
        workspace_id: user.workspace_id_active,
        desc: `đã xóa tập tin đính kèm ${fileName} khỏi thẻ này`,
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: activity,
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
      });
    }
    res.status(response.status).json(response);
  },
};
