const { Card } = require("../models/index");
const { isAfter, subDays, isBefore } = require("date-fns");

module.exports = {
  HandleExpired: async () => {
    const cards = await Card.findAll();

    for (const card of cards) {
      const currentTime = new Date();
      const oneDayBeforeEnd = subDays(card.endDateTime, 1);

      if (card.endDateTime && isAfter(currentTime, card.endDateTime)) {
        await card.update({ status: "expired" });
      } else if (
        isAfter(currentTime, oneDayBeforeEnd) &&
        isBefore(currentTime, mission.endDateTime)
      ) {
        await card.update({ status: "up_expired" });
      }
    }
  },
};
