const {
  User,
  Provider,
  Workspace,
  Role,
  UserWorkspaceRole,
} = require("../models/index");
const GoogleStrategy = require("passport-google-oauth20");
const { Op } = require("sequelize");
module.exports = new GoogleStrategy(
  {
    clientID:
      "194272781561-3llf3aiuf1rp1ike0i5dcotlmf1picub.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/login/google/callback",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, cb) => {
    const {
      photos: [{ value: avatar }],
      displayName: name,
      emails: [{ value: email }],
    } = profile;

    // Kiểm tra provider
    // Nếu tồn tại --> Lấy provider cũ
    // Nếu ko tồn tại --> Thêm mới provider
    const provider = await Provider.findOrCreate({
      where: { name: "google" },
      defaults: {
        name: "google",
      },
    });
    //Kiểm tra user
    // - Nếu tồn tại --> Lấy user cũ
    // - Nếu ko tồn tại --> Thêm user mới
    const user = await User.findOrCreate({
      where: { email, provider_id: provider[0].id },
      defaults: {
        name: name,
        email: email,
        status: true,
        avatar: avatar,
        provider_id: provider[0].id,
      },
    });
    // const [user_workspace_role, created] = await UserWorkspaceRole.findOrCreate(
    //   {
    //     where: { user_id: user.id },
    //     defaults: { user_id: user.id },
    //   }
    // );
    // const role = await Role.findOne({
    //   where: { name: { [Op.iLike]: "%Owner%" } },
    // });
    // if (created && role) {
    //   const workspace = await Workspace.create({
    //     name: "Workspace 1",
    //     total_user: 1,
    //     isActive: true,
    //   });

    //   await user_workspace_role.update({
    //     role_id: role.id,
    //     workspace_id: workspace.id,
    //   });

    //   await user.update({
    //     workspace_id_active: workspace.id,
    //   });
    // }

    if (user) {
      return cb(null, user[0]);
    }
    cb(null, {});
  }
);
