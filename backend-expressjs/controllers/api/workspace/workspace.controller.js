const { Workspace, Board } = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
const WorkspaceTransformer = require("../../../transformers/workspace/workspace.transformer");

module.exports = {
  index: async (req, res) => {
    const {
      order = "desc",
      sort = "updated_at",
      user_id,
      q,
      isActive,
      limit,
      page = 1,
    } = req.query;
    const filters = {};
    if (user_id) {
      filters.user_id = user_id;
    }
    if (isActive) {
      filters.isActive = isActive;
    }
    const options = {
      order: [[sort, order]],
      where: filters,
      include: {
        model: Board,
        as: "boards",
      },
    };
    if (limit && Number.isInteger(+limit)) {
      const offset = (page - 1) * limit;
      options.limit = limit;
      options.offset = offset;
    }

    const response = {};
    try {
      const { count, rows: workspaces } = await Workspace.findAndCountAll(
        options
      );
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
  update: async (req, res) => {
    const { id } = req.params;
    const method = req.method;
    const rules = {};

    if (req.body.title) {
      rules.title = string().required("Chưa nhập tiêu đề");
    }

    const schema = object(rules);
    const response = {};
    //Validate
    try {
      let body = await schema.validate(req.body, {
        abortEarly: false,
      });

      // if (method === "PUT") {
      //   body = Object.assign(
      //     {
      //       desc: null,
      //     },
      //     body
      //   );
      // }
      await Workspace.update(body, {
        where: { id },
      });
      const workspace = await Workspace.findByPk(id, {
        include: {
          model: Board,
          as: "boards",
        },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new WorkspaceTransformer(workspace),
      });
    } catch (e) {
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
    const { id } = req.params;
    await Workspace.destroy({ where: { id } });
    res.status(204).json({
      status: 204,
      message: "Success",
    });
  },
  // switch: async (req, res) => {
  //   const { id, user_id } = req.body;
  //   const response = {};

  //   try {
  //     if (id && user_id) {
  //       const workspace = await Workspace.findByPk(id);
  //       if (!workspace) {
  //         Object.assign(response, {
  //           status: 404,
  //           message: "Not Found",
  //         });
  //       } else {
  //         if ((user_id = workspace.user_id)) {
  //           await Workspace.update(user_id, {
  //             isActive: false,
  //           });
  //           workspace.update({ isActive: true });
  //           Object.assign(response, {
  //             status: 200,
  //             message: "Success",
  //             data: new WorkspaceTransformer(workspace),
  //           });
  //         } else {
  //           Object.assign(response, {
  //             status: 400,
  //             message: "Bad Request",
  //           });
  //         }
  //       }
  //     } else {
  //       Object.assign(response, {
  //         status: 400,
  //         message: "Bad Request",
  //       });
  //     }
  //   } catch (error) {
  //     response.status = 500;
  //     response.message = "Server Error";
  //   }
  //   res.status(response.status).json(response);
  // },
};
