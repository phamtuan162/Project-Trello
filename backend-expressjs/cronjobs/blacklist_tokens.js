const { BlacklistToken } = require("../models/index");

module.exports = {
  delete: async () => {
    await BlacklistToken.delete();
  },
};
