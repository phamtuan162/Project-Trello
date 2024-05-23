const {
  Mission,
  User,
  Card,
  Board,
  Workspace,
  Column,
  Work,
} = require("../models/index");
const { isAfter, subDays, isBefore } = require("date-fns");
const sendMail = require("../utils/mail");

module.exports = {
  HandleExpired: async () => {
    const missions = await Mission.findAll({
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Work,
          as: "work",
        },
      ],
    });

    for (const mission of missions) {
      const currentTime = new Date();
      const oneDayBeforeEnd = subDays(mission.endDateTime, 1);

      if (mission.endDateTime && isAfter(currentTime, mission.endDateTime)) {
        await mission.update({ status: "expired" });
        const card = await Card.findByPk(mission.work.card_id);
        if (mission.user && card) {
          const workspace = await Workspace.findByPk(mission.workspace_id);
          const column = await Column.findByPk(card.column_id);
          const board = column ? await Board.findByPk(column.board_id) : null;

          if (workspace && board && mission.user.email) {
            const link = `http://localhost:3000/w/${workspace.id}`;
            const html = `<p>Công việc <b> ${mission.name}</b> của bạn trong Bảng làm việc <b>${board.title}</b>  thuộc Không gian làm việc <a href="${link}">${workspace.name}</a> <span style="color:red">đã hết hạn</span>!</p>`;
            sendMail(mission.user.email, "Thông báo công việc hết hạn", html);
          }
        }
      } else if (
        isAfter(currentTime, oneDayBeforeEnd) &&
        isBefore(currentTime, mission.endDateTime)
      ) {
        await mission.update({ status: "up_expired" });
      }
    }
  },
};
