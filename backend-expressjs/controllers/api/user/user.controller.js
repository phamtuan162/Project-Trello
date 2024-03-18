const {
  User,
  Workspace,
  Board,
  Column,
  Card,
  Device,
} = require("../../../models/index");
const { Op } = require("sequelize");
const { object, string } = require("yup");
const bcrypt = require("bcrypt");
const UserTransformer = require("../../../transformers/user/user.transformer");
const getFileChecksum = require("../../../utils/checkDuplicateFile");
const fs = require("fs");
const path = require("path");

module.exports = {
  index: async (req, res) => {
    const {
      order = "asc",
      sort = "id",
      status,
      q,
      limit,
      page = 10,
    } = req.query;
    const filters = {};
    if (status === "true" || status === "false") {
      filters.status = status === "true";
    }
    if (q) {
      filters[Op.or] = {
        name: {
          [Op.iLike]: `%${q.trim()}%`,
        },
        email: {
          [Op.iLike]: `%${q.trim()}%`,
        },
      };
    }
    const options = {
      order: [[sort, order]],
      attributes: { exclude: ["password"] },
      where: filters,
    };

    if (limit && Number.isInteger(+limit)) {
      const offset = (page - 1) * limit;
      options.limit = limit;
      options.offset = offset;
    }

    const response = {};

    try {
      const { count, rows: users } = await User.findAndCountAll(options);
      response.status = 200;
      response.message = "Success";
      response.data = new UserTransformer(users);
      // response.data = users;
      response.count = count;
    } catch (e) {
      response.status = 500;
      response.message = "Server Error";
    }
    res.status(response.status).json(response);
  },
  find: async (req, res) => {
    const { id } = req.params;
    const response = {};
    try {
      const user = await User.findByPk(id, {
        include: {
          model: Device,
          as: "devices",
        },
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        Object.assign(response, {
          status: 404,
          message: "Not Found",
        });
      } else {
        Object.assign(response, {
          status: 200,
          message: "Success",
          data: user,
        });
      }
    } catch (e) {
      response.status = 500;
      response.message = "Server Error";
    }
    res.status(response.status).json(response);
  },
  store: async (req, res) => {
    const schema = object({
      name: string().required("Tên bắt buộc phải nhập"),
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng"),
      password: string().required("Mật khẩu bắt buộc phải nhập"),
      status: string()
        .required("Trạng thái bắt buộc phải nhập")
        .test("check-boolean", "Trạng thái không hợp lệ", (value) => {
          return value === "true" || value === "false";
        }),
    });
    const response = {};
    //Validate
    try {
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });
      body.status = body.status === "true";
      body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10));
      const user = await User.create(body);
      delete user.dataValues.password;
      Object.assign(response, { status: 201, message: "Success", data: user });
    } catch (e) {
      const errors = Object.fromEntries(
        e.inner.map(({ path, message }) => [path, message])
      );
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        errors,
      });
    }
    res.status(response.status).json(response);
  },
  update: async (req, res) => {
    const { id } = req.params;
    const method = req.method;
    const rules = {};
    if (req.body.name) {
      rules.name = string().min(5, "Tên phải từ 5 ký tự");
    }
    if (req.body.email) {
      rules.email = string().email("Email không đúng định dạng");
    }
    if (req.body.password) {
      rules.password = string().min(6, "Mật khẩu phải từ 6 ký tự");
    }
    if (req.body.status) {
      rules.status = string().test(
        "check-boolean",
        "Trạng thái không hợp lệ",
        (value) => {
          return value === "true" || value === "false";
        }
      );
    }
    const schema = object(rules);
    const response = {};
    //Validate
    try {
      let body = await schema.validate(req.body, {
        abortEarly: false,
      });
      if (body.status === "true" || body.status === "false") {
        body.status = body.status === "true";
      }

      if (body.password) {
        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10));
      }
      // if (method === "PUT") {
      //   body = Object.assign(
      //     {
      //       name: null,
      //       password: null,
      //       status: null,
      //     },
      //     body
      //   );
      // }
      await User.update(body, {
        where: { id },
      });
      const user = await User.findByPk(id);
      delete user.dataValues.password;
      Object.assign(response, { status: 200, message: "Success", data: user });
    } catch (e) {
      // const errors = Object.fromEntries(
      //   e?.inner?.map(({ path, message }) => [path, message])
      // );
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        e,
      });
    }
    res.status(response.status).json(response);
  },
  updateAvatar: async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "images",
      "avatars",
      "uploads"
    );
    const filePath = path.join(uploadDir, file.name);

    const response = {};
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "Not found" });
    }

    try {
      if (user.avatar) {
        const oldAvatarPath = user.avatar;
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      await fs.promises.copyFile(file.path, filePath);

      await User.update({ avatar: filePath }, { where: { id } });

      Object.assign(response, {
        status: 200,
        message: "Success",
        avatar: filePath,
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
        error: error.message,
      });
    }

    res.status(response.status).json(response);
  },

  delete: async (req, res) => {
    const { email, id } = req.body;
    const response = {};
    const user = await User.findOne({ where: { email: email, id: id } });
    if (!user) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: "Hãy đảm bảo nhập đúng email để xóa tài khoản của bạn",
      });
    } else {
      const workspaces = await Workspace.findAll({ where: { user_id: id } });

      await Promise.all(
        workspaces.map(async (workspace) => {
          const boards = await Board.findAll({
            where: { workspace_id: workspace.id },
          });

          await Promise.all(
            boards.map(async (board) => {
              const columns = await Column.findAll({
                where: { board_id: board.id },
              });

              await Promise.all(
                columns.map(async (column) => {
                  await Card.destroy({ where: { column_id: column.id } });
                })
              );

              await Column.destroy({ where: { board_id: board.id } });
            })
          );

          await Board.destroy({ where: { workspace_id: workspace.id } });
          await Workspace.destroy({ where: { user_id: id } });
        })
      );

      await Device.destroy({ where: { user_id: id } });
      await User.destroy({ where: { id } });
      Object.assign(response, {
        status: 200,
        message: "Success",
      });
    }

    res.status(response.status).json(response);
  },
};
