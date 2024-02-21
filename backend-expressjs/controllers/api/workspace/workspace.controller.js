const { Workspace, Board } = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
const WorkspaceTransformer = require("../../../transformers/workspace/workspace.transformer");

module.exports = {
  index: async (req, res) => {
    const { order = "asc", sort = "id", user_id, q } = req.query;
    const filters = {};
    if (user_id) {
      filters.user_id = user_id;
    }
    const options = {
      order: [[sort, order]],
      where: filters,
      include: {
        model: Board,
        as: "boards",
      },
    };
    const response = {};
    try {
      const workspaces = await Workspace.findAll(options);
      response.status = 200;
      response.message = "Success";
      response.data = new WorkspaceTransformer(workspaces);
    } catch (e) {
      response.status = 500;
      response.message = "Server error";
    }

    res.status(response.status).json(response);
  },
  find: async (req, res) => {
    const { id } = req.params;
    const response = {};
    try {
      const workspace = await Workspace.findByPk(id, {
        include: {
          model: Board,
          as: "boards",
        },
      });
      if (!workspace) {
        Object.assign(response, {
          status: 404,
          message: "Not Found",
        });
      } else {
        Object.assign(response, {
          status: 200,
          message: "Success",
          data: new WorkspaceTransformer(workspace),
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
      name: string().required("Chưa nhập tên không gian làm việc"),
      desc: string().required("Chưa nhập mô tả không gian làm việc"),
    });
    const response = {};
    try {
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });
      const workspace = await Workspace.create(body);

      Object.assign(response, {
        status: 201,
        message: "Success",
        data: new WorkspaceTransformer(workspace),
      });
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

  delete: async (req, res) => {
    const { id } = req.params;
    await Workspace.destroy({ where: { id } });
    res.status(204).json({
      status: 204,
      message: "Success",
    });
  },
};
