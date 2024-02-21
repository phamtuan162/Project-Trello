const jwt = require("jsonwebtoken");
const { User } = require("../../../models/index");
const bcrypt = require("bcrypt");

module.exports = {
  login: async (req, res) => {
    //Lấy body
    const { email, password } = req.body;
    //Validate
    const response = {};
    if (!email || !password) {
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        error: "vui lòng nhập đầy đủ email và mật khẩu",
      });
    } else {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        Object.assign(response, {
          status: 400,
          message: "Bad Request",
          error: "Email hoặc mật khẩu không chính xác",
        });
      } else {
        //Tạo token (JWT)
        const { password: hash } = user;
        const result = bcrypt.compareSync(password, hash);
        if (!result) {
          Object.assign(response, {
            status: 400,
            message: "Bad Request",
            error: "Email hoặc mật khẩu không chính xác",
          });
        } else {
          const { JWT_SECRET, JWT_EXPIRE } = process.env;
          const token = jwt.sign({ data: user.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRE,
          });
          Object.assign(response, {
            status: 200,
            message: "Success",
            access_token: token,
          });
        }
      }
    }
    // Kiểm tra email có tồn tại trong Database không?
    // Lấy password hash
    //Compare plain password với password hash
    // Tạo Token {JWT}
    res.status(response.status).json(response);
  },
  profile: async (req, res) => {
    const bearer = req.header["Authorization"];
    const response = {};
    if (bearer) {
      const token = bearer.replace("Bearer", "").trim();
      const { JWT_SECRET } = process.env;
      try {
        const { data: userId } = decoded;
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(userId);
        Object.assign(response, {
          status: 200,
          message: "Success",
          data: user,
        });
      } catch (e) {
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
  },
};
