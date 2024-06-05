const { Op } = require("sequelize");
const {
  Column,

  Activity,
} = require("../models/index");

module.exports = {
  delete: async () => {
    try {
      const columns = await Column.findAll({
        include: { model: Activity, as: "activities" },

        paranoid: false,
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
        },
      });

      for (const column of columns) {
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
