const { Card } = require("../models/index");
const { isBefore, isAfter } = require("date-fns");

module.exports = {
  HandleExpired: async () => {
    const currentTime = new Date();

    const cards = await findAll();

    for (const card of cards) {
      if (card.endDateTime && isAfter(currentTime, card.endDateTime)) {
        await card.update({ status: "expired" });
      }
    }
  },
};
