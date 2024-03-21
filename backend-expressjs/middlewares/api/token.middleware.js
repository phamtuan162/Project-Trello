const jwt = require("jsonwebtoken");
const { User } = require("../../models/index");
module.exports = async (req, res, next) => {
  const { token } = req.query;
  const { JWT_SECRET } = process.env;

  const response = {};
  try {
    var decoded = jwt.verify(token, JWT_SECRET);

    const { data: userId } = decoded;
    const user = await User.findOne({
      where: {
        id: userId,
      },

      attributes: {
        exclude: ["password"],
      },
    });
    req.user = {
      ...user.dataValues,
    };

    return next();
  } catch (error) {
    Object.assign(response, {
      status: 401,
      message: "Unauthorized",
      error: `Link xác thực đã hết hạn hoặc không tồn tại,  <a href='/auth/forgot-password'>Nhấn vào đây để lấy lại link</a>`,
    });
  }

  return res.json(response);
};
