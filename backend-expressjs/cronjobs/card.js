const {
  Card,
  User,
  Column,
  Board,
  Workspace,
  Comment,
  Attachment,
  Work,
  Mission,
  Activity,
} = require("../models/index");
const { isAfter, subDays, isBefore, subHours } = require("date-fns");
const sendMail = require("../utils/mail");
const { Op } = require("sequelize");

module.exports = {
  HandleExpired: async () => {
    const cards = await Card.findAll({
      include: { model: User, as: "users" },
      where: {
        endDateTime: { [Op.not]: null }, // endDateTime không null
      },
    });
    for (const card of cards) {
      const currentTime = new Date();
      const oneDayBeforeEnd = subDays(card.endDateTime, 1);
      const oneHourBeforeEnd = subHours(currentTime, 1);
      const workspace = await Workspace.findByPk(card.workspace_id);
      const column = await Column.findByPk(card.column_id);
      const board = column ? await Board.findByPk(column.board_id) : null;
      if (workspace && board && card.users.length > 0) {
        const link = `http://localhost:3000/w/${workspace.id}`;

        if (
          isBefore(oneHourBeforeEnd, card.endDateTime) &&
          isAfter(currentTime, card.endDateTime)
        ) {
          await card.update({ status: "expired" });

          const html = `<p>Thẻ <b>${card.title}</b> của bạn trong Bảng làm việc <b>${board.title}</b> thuộc Không gian làm việc <a href=${link}>${workspace.name}</a> <span style="color:red">đã hết hạn</span>!</p>`;

          await Promise.all(
            card.users.map((user) => {
              if (user.email) {
                return sendMail(user.email, "Thông báo thẻ hết hạn", html);
              }
              return Promise.resolve();
            })
          );
        } else if (
          isAfter(currentTime, oneDayBeforeEnd) &&
          isBefore(currentTime, card.endDateTime)
        ) {
          await card.update({ status: "up_expired" });
          // const html = `<p>Thẻ <b>${
          //   card.title
          // }</b> của bạn trong Bảng làm việc <b>${
          //   board.title
          // }</b> thuộc Không gian làm việc <a href=${link}>${
          //   workspace.name
          // }</a> <span style="color:red">sắp hết hạn  ${formatDistanceToNow(
          //   new Date(card.endDateTime),
          //   {
          //     addSuffix: true,
          //     locale: vi,
          //   }
          // )}}</span>!</p>`;

          // await Promise.all(
          //   card.users.map((user) => {
          //     if (user.email) {
          //       return sendMail(user.email, "Thông báo thẻ sắp hết hạn", html);
          //     }
          //     return Promise.resolve();
          //   })
          // );
        }
      }
    }
  },
  delete: async () => {
    const cards = await Card.findAll({
      include: [
        { model: Activity, as: "activities" },
        { model: Comment, as: "comments" },
        { model: Attachment, as: "attachments" },
        { model: User, as: "users" },
        {
          model: Work,
          as: "works",
          include: { model: Mission, as: "missions" },
        },
      ],
      paranoid: false,
      where: {
        deleted_at: {
          [Op.ne]: null, // chỉ lấy các bản ghi bị xóa mềm
        },
      },
    });
    if (cards.length > 0) {
      for (const card of cards) {
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
        if (card.activities.length > 0) {
          await Activity.update(
            { card_id: null },
            { where: { card_id: card.id } }
          );
        }
        await card.destroy({ force: true });
      }
    }
  },
};
