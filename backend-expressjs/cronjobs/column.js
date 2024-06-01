const { Op } = require("sequelize");
const {
  Column,
  Card,
  Comment,
  Attachment,
  User,
  Work,
  Mission,
} = require("../models/index");

module.exports = {
  delete: async () => {
    try {
      const columns = await Column.findAll({
        include: {
          model: Card,
          as: "cards",
          include: [
            { model: Comment, as: "comments" },
            { model: Attachment, as: "attachments" },
            { model: User, as: "users" },
            {
              model: Work,
              as: "works",
              include: { model: Mission, as: "missions" },
            },
          ],
        },
        paranoid: false,
      });

      for (const column of columns) {
        for (const card of column.cards) {
          if (card.users.length > 0) {
            await card.removeUsers(card.users);
          }
          if (card.comments.length > 0) {
            await Comment.destroy({ where: { card_id: card.id } });
          }
          if (card.attachments.length > 0) {
            await Attachment.destroy({ where: { card_id: card.id } });
          }
          if (card.works.length > 0) {
            for (const work of card.works) {
              if (work.missions.length > 0) {
                await Mission.destroy({ where: { work_id: work.id } });
              }
              await work.destroy();
            }
          }
          await card.destroy({ force: true });
        }
        await column.destroy({ force: true });
      }
    } catch (error) {
      throw error;
    }
  },
};
