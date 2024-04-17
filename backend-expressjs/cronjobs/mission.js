const { Mission } = require("../models/index");
const { isAfter } = require("date-fns");

module.exports = {
  HandleExpired: async () => {
    const missions = await Mission.findAll();

    for (const mission of missions) {
      const currentTime = new Date();

      if (mission.endDateTime && isAfter(currentTime, mission.endDateTime)) {
        await mission.update({ status: "expired" });
      }
    }
  },
};
