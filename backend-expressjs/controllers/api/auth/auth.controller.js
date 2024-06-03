const jwt = require("jsonwebtoken");
const {
  User,
  BlacklistToken,
  Device,
  Provider,
  Workspace,
  Board,
  UserWorkspaceRole,
  Role,
  Notification,
} = require("../../../models/index");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
var ip = require("ip");
const UAParser = require("ua-parser-js");
const sendMail = require("../../../utils/mail");

const generateToken = () => {
  return crypto.randomBytes(16).toString("hex");
};
module.exports = {
  login: async (req, res) => {
    //Lấy body
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    //Validate
    const response = {};
    if (!email || !password) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: "Vui lòng nhập email và mật khẩu",
      });
    } else {
      //Kiểm tra email có tồn tại trong Database không?
      const user = await User.findOne({
        where: { email: email },
      });

      if (!user) {
        Object.assign(response, {
          status: 400,
          message: "Bad Request",
          error: "Email hoặc mật khẩu không chính xác",
        });
      } else {
        //Lấy password hash
        const { password: hash } = user;
        if (hash === null) {
          Object.assign(response, {
            status: 400,
            message: "Bad Request",
            error:
              "Email này đã được đăng nhập bằng google ấn quên mật khẩu để lấy mật khẩu ",
          });
        } else {
          //Compare plain password với password hash
          const result = bcrypt.compareSync(password, hash);
          if (!result) {
            Object.assign(response, {
              status: 400,
              message: "Bad Request",
              error: "Email hoặc mật khẩu không chính xác",
            });
          } else {
            //Tạo Token (JWT)
            if (user.status === false) {
              Object.assign(response, {
                status: 400,
                message: "Bad Request",
                error: "Tài khoản chưa được kích hoạt",
              });
            } else {
              const { JWT_SECRET, JWT_EXPIRE, JWT_REFRESH_EXPIRE } =
                process.env;
              const token = jwt.sign(
                {
                  data: user.id,
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRE }
              );
              const refresh = jwt.sign(
                {
                  data: new Date().getTime() + Math.random(),
                },
                JWT_SECRET,
                { expiresIn: JWT_REFRESH_EXPIRE }
              );
              await User.update(
                {
                  refresh_token: refresh,
                },
                {
                  where: { id: user.id },
                }
              );

              // Tìm hoặc tạo mới thông tin thiết bị
              const [device, created] = await Device.findOrCreate({
                where: {
                  user_id: user.id,
                  browser: browser.name,
                  system: os.name,
                  ip: ip.address(),
                },
                defaults: {
                  user_id: user.id,
                  browser: browser.name,
                  system: os.name,
                  ip: ip.address(),
                  login_time: new Date(),
                  active_time: new Date(),
                  status: true,
                },
              });

              // Nếu thiết bị đã tồn tại, cập nhật lại thông tin
              if (!created) {
                await Device.update(
                  { active_time: new Date(), status: true },
                  {
                    where: {
                      id: device.id,
                    },
                  }
                );
              }

              Object.assign(response, {
                status: 200,
                message: "Success",
                access_token: token,
                refresh_token: refresh,
                device_id_current: device.id,
              });
            }
          }
        }
      }
    }

    res.status(response.status).json(response);
  },
  register: async (req, res) => {
    //Lấy body
    const { email, password, name } = req.body;
    //Validate
    const response = {};

    if (!email || !password || !name) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: "Vui lòng nhập đầy đủ thông tin",
      });
    } else {
      //Kiểm tra email có tồn tại trong Database không?
      const user = await User.findOne({
        where: { email },
      });
      if (user) {
        Object.assign(response, {
          status: 400,
          message: "Bad Request",
          error: "Email đã tồn tại",
        });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await User.create({
          name: name,
          email: email,
          password: hashPassword,
          status: false,
        });
        const userNew = await User.findOne({
          where: { email },
        });
        const { JWT_SECRET } = process.env;

        const token = jwt.sign(
          {
            data: userNew.id,
          },
          JWT_SECRET,
          {
            expiresIn: "15m",
          }
        );
        const link = `http://localhost:3000/auth/register/verify?token=${token}`;
        const html = `<a href="${link}" style="background-color: #7b68ee; color: #ffffff !important; display: inline-block;text-align:center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 600; line-height: 48px; margin: 0 !important; max-width: 220px; padding: 0; text-decoration: none; width: 220px !important;border-radius: 3px;
        border-spacing: 0">Xác thực tài khoản</a>`;

        await sendMail(email, "Xác thực tài khoản", html);

        Object.assign(response, {
          status: 200,
          message:
            "Bạn đã đăng ký thành công,Vui lòng vào email để xác thực tài khoản!",
        });
      }
    }
    res.status(response.status).json(response);
  },
  checkEmail: async (req, res) => {
    const { email } = req.body;
    const response = {};

    const user = await User.findOne({
      where: { email },
    });
    if (user) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: "Email đã tồn tại",
      });
    } else {
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: { email: email },
      });
    }
    res.status(response.status).json(response);
  },

  profile: async (req, res) => {
    const { id } = req.user.dataValues;
    const user = await User.findByPk(id, {
      include: [
        {
          model: Device,
          as: "devices",
        },
        {
          model: Workspace,
          as: "workspaces",
          include: {
            model: Board,
            as: "boards",
          },
        },
        {
          model: Provider,
          as: "providers",
        },
        {
          model: Notification,
          as: "notifications",
        },
      ],
      order: [
        [{ model: Device, as: "devices" }, "active_time", "desc"], // Sắp xếp Device trong mối quan hệ devices theo active_time
        [{ model: Notification, as: "notifications" }, "created_at", "desc"], // Sắp xếp Notification theo createdAt
      ],
      attributes: { exclude: ["password"] },
    });
    await user.update({ isOnline: true });
    const user_workspace_role = await UserWorkspaceRole.findOne({
      where: { user_id: id, workspace_id: user.workspace_id_active },
    });
    if (user_workspace_role?.role_id) {
      const role = await Role.findByPk(user_workspace_role.role_id);
      if (role) {
        user.dataValues.role = role.name;
      }
    }
    if (user.workspaces.length > 0) {
      for (const workspace of user.workspaces) {
        const user_workspace_role_item = await UserWorkspaceRole.findOne({
          where: { user_id: id, workspace_id: workspace.id },
        });
        if (user_workspace_role_item) {
          const role = await Role.findByPk(user_workspace_role_item.role_id);
          if (role) {
            workspace.dataValues.role = role.name;
          }
        }
      }
    }

    res.json({
      status: 200,
      message: "Success",
      data: user,
    });
  },

  logout: async (req, res) => {
    const { accessToken } = req.user;
    await BlacklistToken.findOrCreate({
      where: {
        token: accessToken,
      },
      defaults: { token: accessToken },
    });
    await User.update(
      { isOnline: false },
      {
        where: { id: req.user.dataValues.id },
      }
    );
    res.json({
      status: 200,
      message: "Success",
    });
  },

  refresh: async (req, res) => {
    const { refresh_token: refreshToken } = req.body;
    const response = {};
    //Kiểm tra refresh có hợp lệ hay không?
    if (!refreshToken) {
      Object.assign(response, {
        status: 401,
        message: "Unauthorized",
      });
    } else {
      const { JWT_SECRET, JWT_EXPIRE } = process.env;
      try {
        jwt.verify(refreshToken, JWT_SECRET);
        const user = await User.findOne({
          where: {
            refresh_token: refreshToken,
          },
        });
        if (!user) {
          Object.assign(response, {
            status: 401,
            message: "Unauthorized",
          });
        }
        const accessToken = jwt.sign(
          {
            data: user.id,
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRE }
        );

        Object.assign(response, {
          status: 200,
          message: "Success",
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      } catch (e) {
        Object.assign(response, {
          status: 401,
          message: "Unauthorized",
        });
      }
    }
    res.status(response.status).json(response);
  },

  changePassword: async (req, res) => {
    const { id } = req.params;
    const { password_old, password_new } = req.body;
    const response = {};

    const user = await User.findByPk(id);
    if (!user) {
      Object.assign(response, {
        status: 404,
        message: "Not found",
      });
    } else {
      const { password: hash } = user;
      if (hash === null) {
        Object.assign(response, {
          status: 400,
          message: "Bad Request",
          error: "Tài khoản này đăng nhập bằng mxh chưa được kích hoạt",
        });
      } else {
        const result = bcrypt.compareSync(password_old, hash);
        if (!result) {
          Object.assign(response, {
            status: 400,
            message: "Bad Request",
            error: "Mật khẩu hiện tại không chính xác",
          });
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = await bcrypt.hash(password_new, salt);
          await User.update(
            {
              password: hashPassword,
            },
            {
              where: { id: id },
            }
          );
          Object.assign(response, {
            status: 200,
            message: "Success",
          });
        }
      }
    }

    res.status(response.status).json(response);
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const response = {};
    if (!email) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: "Vui lòng nhập email",
      });
    } else {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        Object.assign(response, {
          status: 400,
          message: "Bad Request",
          error: "Email không tồn tại",
        });
      } else {
        const { JWT_SECRET } = process.env;
        const token = jwt.sign(
          {
            data: user.id,
          },
          JWT_SECRET,
          {
            expiresIn: "15m",
          }
        );
        const link = `http://localhost:3000/auth/reset-password?token=${token}`;
        const html = `<a href="${link}" style="background-color: #7b68ee; color: #ffffff !important; display: inline-block;text-align:center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 600; line-height: 48px; margin: 0 !important; max-width: 220px; padding: 0; text-decoration: none; width: 220px !important;border-radius: 3px;
        border-spacing: 0">Làm mới mật khẩu</a>`;

        await sendMail(email, "Làm mới mật khẩu", html);

        Object.assign(response, {
          status: 200,
          message:
            "Đường link đã được gửi vào email, Vui lòng vào email kiểm tra!",
        });
      }
    }
    res.status(response.status).json(response);
  },
  resetPassword: async (req, res) => {
    const { password_new } = req.body;
    const response = {};

    if (!password_new) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: "Vui lòng nhập password mới",
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hash(password_new, salt);
      await User.update(
        {
          password: hashPassword,
          status: true,
        },
        {
          where: { id: req.user.id },
        }
      );
      Object.assign(response, {
        status: 200,
        message: "Làm mới mật khẩu thành công",
      });
    }
    res.status(response.status).json(response);
  },
  verifyAccount: async (req, res) => {
    const response = {};
    await User.update(
      {
        status: true,
      },
      {
        where: { id: req.user.id },
      }
    );
    Object.assign(response, {
      status: 200,
      message: "Xác thực tài khoản thành công",
    });
    res.status(response.status).json(response);
  },
};
