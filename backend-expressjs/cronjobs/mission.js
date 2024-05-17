const { Mission } = require("../models/index");
const { isAfter, subDays, isBefore } = require("date-fns");

module.exports = {
  HandleExpired: async () => {
    const missions = await Mission.findAll();

    for (const mission of missions) {
      const currentTime = new Date();
      const oneDayBeforeEnd = subDays(mission.endDateTime, 1);

      if (mission.endDateTime && isAfter(currentTime, mission.endDateTime)) {
        await mission.update({ status: "expired" });
      } else if (
        isAfter(currentTime, oneDayBeforeEnd) &&
        isBefore(currentTime, mission.endDateTime)
      ) {
        await mission.update({ status: "up_expired" });
      }
    }
  },
};
