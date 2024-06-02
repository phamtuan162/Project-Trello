const { Op } = require("sequelize");
const {
  Column,
  Card,
  Comment,
  Attachment,
  User,
  Work,
  Mission,
  Activity,
} = require("../models/index");

module.exports = {
  delete: async () => {
    try {
      const columns = await Column.findAll({
        include: [
          {
            model: Card,
            as: "cards",
          },
          { model: Activity, as: "activities" },
        ],

        paranoid: false,
      });

      for (const column of columns) {
        if (column.cards.length > 0) {
          for (const card of column.cards) {
            await card.update({ column_id: null });
            await card.destroy();
          }
        }

        if (column.activities.length > 0) {
          await Activity.update(
            { column_id: null },
            { where: { column_id: column.id } }
          );
        }
        await column.destroy({ force: true });
      }
    } catch (error) {
      throw error;
    }
  },
};
