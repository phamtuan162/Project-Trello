const { Card, User, Column, Board, Workspace } = require("../models/index");
const { isAfter, subDays, isBefore } = require("date-fns");
const sendMail = require("../utils/mail");

module.exports = {
  HandleExpired: async () => {
    const cards = await Card.findAll({ include: { model: User, as: "users" } });

    for (const card of cards) {
      const currentTime = new Date();
      const oneDayBeforeEnd = subDays(card.endDateTime, 1);

      if (card.endDateTime && isAfter(currentTime, card.endDateTime)) {
        await card.update({ status: "expired" });

        if (card.users.length > 0) {
          const workspace = await Workspace.findByPk(card.workspace_id);
          const column = await Column.findByPk(card.column_id);
          const board = column ? await Board.findByPk(column.board_id) : null;

          if (workspace && column && board) {
            const link = `http://localhost:3000/w/${workspace.id}`;
            const html = `<p>Thẻ <b>${card.title}</b> của bạn trong Bảng làm việc <b>${board.title}</b> thuộc Không gian làm việc <a href=${link}>${workspace.name}</a> <span style="color:red">đã hết hạn</span>!</p>`;

            // Send emails concurrently
            await Promise.all(
              card.users.map((user) => {
                if (user.email) {
                  return sendMail(user.email, "Thông báo thẻ hết hạn", html);
                }
                return Promise.resolve();
              })
            );
          }
        }
      } else if (
        isAfter(currentTime, oneDayBeforeEnd) &&
        isBefore(currentTime, mission.endDateTime)
      ) {
        await card.update({ status: "up_expired" });
      }
    }
  },
};
