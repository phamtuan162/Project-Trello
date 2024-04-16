const { Card } = require("../models/index");
const { isAfter } = require("date-fns");

module.exports = {
  HandleExpired: async () => {
    const cards = await Card.findAll();

    for (const card of cards) {
      const currentTime = new Date();

      if (card.endDateTime && isAfter(currentTime, card.endDateTime)) {
        await card.update({ status: "expired" });
      }
    }
  },
};
