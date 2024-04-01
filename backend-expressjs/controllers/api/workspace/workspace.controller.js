const {
  Workspace,
  Board,
  Column,
  Card,
  User,
  Role,
  UserWorkspaceRole,
} = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
const WorkspaceTransformer = require("../../../transformers/workspace/workspace.transformer");
const UserTransformer = require("../../../transformers/user/user.transformer");

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
        include: [
          {
            model: Board,
            as: "boards",
          },
          {
            model: User,
            as: "users",
          },
        ],
      });

      if (!workspace) {
        Object.assign(response, {
          status: 404,
          message: "Not Found",
        });
      } else {
        if (workspace.users) {
          for (const user of workspace.users) {
            const user_workspace_role = await UserWorkspaceRole.findOne({
              where: { workspace_id: workspace.id, user_id: user.id },
            });
            const role = await Role.findByPk(user_workspace_role.role_id);

            user.dataValues.role = role.name;
          }
        }
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
    const { user_id } = req.query;
    const response = {};
    const user = await User.findByPk(user_id);

    if (!user) {
      Object.assign(response, {
        status: 404,
        message: "Not found user",
      });
    } else {
      const schema = object({
        name: string().required("Chưa nhập tên không gian làm việc"),
      });
      try {
        const body = await schema.validate(req.body, {
          abortEarly: false,
        });
        const workspace = await Workspace.create({ ...body, total_user: 1 });

        if (workspace) {
          const user_workspace_role = await UserWorkspaceRole.create({
            user_id: user.id,
            workspace_id: workspace.id,
          });

          await user.update({
            workspace_id_active: workspace.id,
          });

          const role = await Role.findOne({
            where: { name: { [Op.iLike]: "%Admin%" } },
          });

          if (role) {
            await user_workspace_role.update({
              role_id: role.id,
            });
            const workspaceNew = await Workspace.findByPk(workspace.id, {
              include: { model: User, as: "users" },
            });
            if (workspaceNew.users) {
              for (const user of workspaceNew.users) {
                const user_workspace_role = await UserWorkspaceRole.findOne({
                  where: { workspace_id: workspace.id, user_id: user.id },
                });
                const role = await Role.findByPk(user_workspace_role.role_id);

                user.dataValues.role = role.name;
              }
            }
            Object.assign(response, {
              status: 200,
              message: "Success",
              data: new WorkspaceTransformer(workspaceNew),
            });
          } else {
            Object.assign(response, {
              status: 500,
              message: "Sever error",
            });
          }
        } else {
          Object.assign(response, {
            status: 500,
            message: "Sever error",
          });
        }
      } catch (e) {
        const errors = Object.fromEntries(
          e?.inner?.map(({ path, message }) => [path, message])
        );
        Object.assign(response, {
          status: 400,
          message: "Bad Request",
          errors,
        });
      }
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
    const response = {};
    try {
      const boards = await Board.findAll({ where: { workspace_id: id } });

      for (const board of boards) {
        const columns = await Column.findAll({ where: { board_id: board.id } });
        for (const column of columns) {
          await Card.destroy({ where: { column_id: column.id } });
        }
        await Column.destroy({ where: { board_id: board.id } });
      }
      await Board.destroy({ where: { workspace_id: id }, force: true });

      await UserWorkspaceRole.destroy({ where: { workspace_id: id } });

      await Workspace.destroy({ where: { id } });

      const users = await User.findAll({
        where: { workspace_id_active: id },
        include: [{ model: Workspace, as: "workspaces" }],
        order: [[{ model: Workspace, as: "workspaces" }, "updated_at", "desc"]],
      });

      for (const user of users) {
        if (user.workspaces.length > 0) {
          const latestWorkspace = user.workspaces[0];
          await user.update({ workspace_id_active: latestWorkspace.id });
        }
      }

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
  inviteUser: async (req, res) => {
    const { user_id, workspace_id, role } = req.body;
    const response = {};

    try {
      if (!user_id || !workspace_id || !role) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }

      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ status: 404, message: "User not found" });
      }
      const workspace = await Workspace.findByPk(workspace_id);
      if (!workspace) {
        return res
          .status(404)
          .json({ status: 404, message: "Workspace not found" });
      }
      const roleInstance = await Role.findOne({
        where: { name: { [Op.iLike]: `%${role}%` } },
      });

      if (!roleInstance) {
        return res.status(404).json({ status: 404, message: "Role not found" });
      }

      const user_workspace_role = await UserWorkspaceRole.create({
        user_id: user_id,
        workspace_id: workspace_id,
        role_id: roleInstance.id,
      });
      await workspace.update({ total_user: workspace.total_user + 1 });
      user.dataValues.role = roleInstance.name;
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new UserTransformer(user.dataValues),
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
        error: error,
      });
    }

    res.status(response.status).json(response);
  },
  leaveWorkspace: async (req, res) => {
    const { user_id, workspace_id } = req.body;
    const response = {};
    try {
      if (!user_id || !workspace_id) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }
      const user_workspace_role = await UserWorkspaceRole.findOne({
        where: { user_id: user_id, workspace_id: workspace_id },
      });
      if (!user_workspace_role) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      await user_workspace_role.destroy();
      const workspace = await Workspace.findByPk(workspace_id, {
        include: { model: User, include: "users" },
      });
      await workspace.update({ total_user: workspace.users.length });
      const user = await User.findOne({
        where: { workspace_id_active: workspace_id },
        include: {
          model: Workspace,
          as: "workspaces",
        },
        order: [[{ model: Workspace, as: "workspaces" }, "updated_at", "desc"]],
      });
      if (user.workspaces.length > 0) {
        user.update({ workspace_id_active: user.workspaces[0].id });
      }
      Object.assign(response, {
        status: 200,
        message: "Success",
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
        error: error,
      });
    }
    res.status(response.status).json(response);
  },
  cancelUser: async (req, res) => {
    const { user_id, workspace_id } = req.body;
    const response = {};
    try {
      if (!user_id || !workspace_id) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }
      const user_workspace_role = await UserWorkspaceRole.findOne({
        where: { user_id: user_id, workspace_id: workspace_id },
      });
      if (!user_workspace_role) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      await user_workspace_role.destroy();
      const workspace = await Workspace.findByPk(workspace_id, {
        include: { model: User, include: "users" },
      });
      await workspace.update({ total_user: workspace.users.length });
      const user = await User.findOne({
        where: { workspace_id_active: workspace_id },
        include: {
          model: Workspace,
          as: "workspaces",
        },
        order: [[{ model: Workspace, as: "workspaces" }, "updated_at", "desc"]],
      });
      if (user.workspaces.length > 0) {
        user.update({ workspace_id_active: user.workspaces[0].id });
      }
      Object.assign(response, {
        status: 200,
        message: "Success",
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
        error: error,
      });
    }
    res.status(response.status).json(response);
  },
  changeWorkspace: async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    const response = {};
    if (!user_id) {
      return res.status(400).json({ status: 400, message: "Bad request" });
    }
    const workspace = await Workspace.findOne({
      where: { id },
      include: [
        { model: User, as: "users" },
        { model: Board, as: "boards" },
      ],
    });
    if (!workspace) {
      return res.status(404).json({ status: 404, message: "Not found" });
    }
    if (workspace.users) {
      for (const user of workspace.users) {
        const user_workspace_role = await UserWorkspaceRole.findOne({
          where: { workspace_id: workspace.id, user_id: user.id },
        });
        const role = await Role.findByPk(user_workspace_role.role_id);

        user.dataValues.role = role.name;
      }
    }
    await User.update(
      { workspace_id_active: workspace.id },
      { where: { id: user_id } }
    );
    Object.assign(response, {
      status: 200,
      message: "Success",
      data: new WorkspaceTransformer(workspace),
    });
    res.status(response.status).json(response);
  },
};
