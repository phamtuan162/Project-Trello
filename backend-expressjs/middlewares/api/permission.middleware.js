const {
  UserWorkspaceRole,
  Role,
  Permission,
  User,
  BlacklistToken,
} = require("../../models/index");
const jwt = require("jsonwebtoken");

module.exports = (permission) => {
  return async (req, res, next) => {
    const bearer = req.get("Authorization");
    const response = {};
    if (bearer) {
      const token = bearer.replace("Bearer", "").trim();
      const { JWT_SECRET } = process.env;

      try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const blacklist = await BlacklistToken.findOne({
          where: {
            token,
          },
        });
        if (blacklist) {
          throw new Error("Token blacklist");
        }

        const { data: userId } = decoded;
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
          throw new Error("User Not Found");
        }
        req.user = {
          ...user,
          accessToken: token,
        };
        const user_workspace_role = await UserWorkspaceRole.findOne({
          where: { user_id: userId, workspace_id: user.workspace_id_active },
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
          message: "Unauthorized",
          error: "Bạn không có đủ quyền hạn để thực hiện thao tác này",
        });
      } catch (error) {
        Object.assign(response, {
          status: 401,
          message: "Unauthorized",
        });
      }
    } else {
      Object.assign(response, {
        status: 401,
        message: "Unauthorized",
      });
    }
    res.status(response.status).json(response);
  };
};
