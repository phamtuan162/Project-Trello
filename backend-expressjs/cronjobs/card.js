const { Card } = require("../models/index");
const { isAfter } = require("date-fns");

module.exports = {
  HandleExpired: async () => {
    const currentTime = new Date();

    const cards = await Card.findAll();

    for (const card of cards) {
      if (card.endDateTime && isAfter(currentTime, card.endDateTime)) {
        await card.update({ status: "expired" });
      }
    }
  },
};
