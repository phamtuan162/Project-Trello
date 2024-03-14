const cron = require("node-cron");
const blacklist_token = require("./cronjobs/blacklist_tokens");
cron.schedule("* 0 * * *", () => {
  blacklist_token.delete();
});
