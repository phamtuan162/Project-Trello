const { UserWorkspaceRole, Role, Permission } = require("../../models/index");

module.exports = (permission) => {
  return async (req, res, next) => {
    const user = req.user.dataValues;
    const { workspace_id } = req.body;

    const response = {};

    try {
      const user_workspace_role = await UserWorkspaceRole.findOne({
        where: {
          user_id: user.id,
          workspace_id: workspace_id ? workspace_id : user.workspace_id_active,
        },
      });
      const role = await Role.findOne({
        where: {
          id: user_workspace_role.role_id,
        },
        include: {
          model: Permission,
          as: "permissions",
        },
      });
      const permissions = [];
      if (role.permissions.length) {
        role.permissions.forEach((permission) => {
          !permissions.includes(permission.value) &&
            permissions.push(permission.value);
        });
      }
      //Kiểm tra 1 quyền cụ thể
      req.can = (value) => {
        return permissions.includes(value);
      };

      if (permissions.includes(permission)) {
        return next();
      }

      Object.assign(response, {
        status: 401,
        message: "Bạn không có đủ quyền hạn để thực hiện thao tác này",
      });
    } catch (error) {
      console.log(error);

      Object.assign(response, {
        status: 500,
        message: "Sever error",
      });
    }

    res.status(response.status).json(response);
  };
};
