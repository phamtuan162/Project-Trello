const {
  Workspace,
  Board,
  Column,
  Card,
  User,
  Role,
  UserWorkspaceRole,
  Activity,
  Work,
  Mission,
  Comment,
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
          {
            model: Activity,
            as: "activities",
          },
        ],
        order: [[{ model: Board, as: "boards" }, "updated_at", "desc"]],
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
            where: { name: { [Op.iLike]: "%Owner%" } },
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
        console.log(e);
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
    const workspace = await Workspace.findByPk(id);
    if (!workspace) {
      return res.status(404).json({ status: 404, message: "Not found" });
    }
    try {
      await workspace.destroy();

      const users = await User.findAll({
        where: { workspace_id_active: id },
        include: [{ model: Workspace, as: "workspaces", limit: 1 }],
        order: [[{ model: Workspace, as: "workspaces" }, "updated_at", "desc"]],
      });
      console.log(users);

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
    const userMain = req.user.dataValues;
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

      await UserWorkspaceRole.create({
        user_id: user_id,
        workspace_id: workspace_id,
        role_id: roleInstance.id,
      });
      const totalUser = workspace.total_user + 1;
      await Workspace.update(
        { total_user: totalUser },
        { where: { id: workspace_id } }
      );

      const activity = await Activity.create({
        user_id: userMain.id,
        userName: userMain.name,
        userAvatar: userMain.avatar,
        title: workspace.name,
        action: "invite_user",
        workspace_id: workspace_id,
        desc: `đã thêm ${user.name} vào Không gian làm việc này`,
      });
      console.log(activity);
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: activity,
      });
    } catch (error) {
      console.log(error);
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
      await Workspace.update(
        { total_user: workspace.users.length }, // giá trị cần cập nhật
        { where: { id: workspace.id } } // điều kiện
      );
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

      const userLeave = await User.findByPk(user_id);

      const cards = await Card.findAll({
        where: { workspace_id: workspace_id },
      });

      if (cards.length > 0) {
        for (const card of cards) {
          await card.removeUser(userLeave);
          await Comment.destroy({
            where: { user_id: user_id, card_id: card.id },
          });
        }
      }
      await Mission.update(
        { user_id: null },
        {
          where: {
            workspace_id: workspace_id,
            user_id: user_id,
          },
        }
      );
      const activity = await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        title: workspace.name,
        action: "leave_user",
        workspace_id: workspace_id,
        desc: `đã rời khỏi Không gian làm việc này`,
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
        error: error,
      });
    }
    res.status(response.status).json(response);
  },
  cancelUser: async (req, res) => {
    const userMain = req.user.dataValues;
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
        include: { model: User, as: "users" },
      });
      await Workspace.update(
        { total_user: workspace.users.length }, // giá trị cần cập nhật
        { where: { id: workspace.id } } // điều kiện
      );
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

      const userCancel = await User.findByPk(user_id);
      const cards = await Card.findAll({
        where: { workspace_id: workspace_id },
      });
      if (cards.length > 0) {
        for (const card of cards) {
          await card.removeUser(userCancel);
          await Comment.destroy({
            where: { user_id: user_id, card_id: card.id },
          });
        }
      }
      await Mission.update(
        { user_id: null },
        {
          where: {
            workspace_id: workspace_id,
            user_id: user_id,
          },
        }
      );
      const activity = await Activity.create({
        user_id: userMain.id,
        userName: userMain.name,
        userAvatar: userMain.avatar,
        title: workspace.name,
        action: "cancel_user",
        workspace_id: workspace_id,
        desc: `đã loại bỏ ${user.name} khỏi Không gian làm việc này`,
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
        {
          model: Activity,
          as: "activities",
        },
      ],
      order: [[{ model: Board, as: "boards" }, "updated_at", "desc"]],
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
  decentRoleUser: async (req, res) => {
    const userMain = req.user.dataValues;
    const { id } = req.params;
    const { user_id, role } = req.body;
    const response = {};
    if (!user_id || !role) {
      return res.status(400).json({ status: 400, message: "Bad request" });
    }
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const roleInstance = await Role.findOne({
      where: { name: { [Op.iLike]: `%${role}%` } },
    });

    if (!roleInstance) {
      return res.status(404).json({ status: 404, message: "Role not found" });
    }
    const user_workspace_role = await UserWorkspaceRole.findOne({
      where: {
        user_id: user_id,
        workspace_id: id,
      },
    });

    if (!user_workspace_role) {
      return res.status(404).json({ status: 404, message: " Not found" });
    }

    user_workspace_role.update({ role_id: roleInstance.id });

    const activity = await Activity.create({
      user_id: userMain.id,
      userName: userMain.name,
      userAvatar: userMain.avatar,
      action: "decent_role",
      workspace_id: id,
      desc: `đã chuyển chức vụ ${user.name} thành ${roleInstance.name} trong Không gian làm việc này`,
    });

    Object.assign(response, {
      status: 200,
      message: "Success",
      data: activity,
    });
    res.status(response.status).json(response);
  },
};
