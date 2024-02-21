const { User, Provider } = require("../models/index");

const GitHubStrategy = require("passport-github2");
module.exports = new GitHubStrategy(
  {
    clientID: "17a35b931446aa200f23",
    clientSecret: "a1c5b941b00762d94189ef4056fb8f5c6aa48693",
    callbackURL: "http://localhost:3000/api/v1/auth/github/callback",
    scope: ["profile", "user:email"],
    state: true,
  },
  async (accessToken, refreshToken, profile, cb) => {
    const {
      displayName: name,
      emails: [{ value: email }],
    } = profile;

    const provider = await Provider.findOrCreate({
      where: { name: "github" },
      defaults: {
        name: "github",
      },
    });

    const user = await User.findOrCreate({
      where: { email, provider_id: provider[0].id },
      defaults: {
        name: name,
        email: email,
        status: true,
        provider_id: provider[0].id,
      },
    });
    if (user) {
      return cb(null, user[0]);
    }
    cb(null, {});
  }
);
