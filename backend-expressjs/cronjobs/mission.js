const {
  Mission,
  User,
  Card,
  Board,
  Workspace,
  Column,
  Work,
} = require("../models/index");
const {
  isAfter,
  subDays,
  isBefore,
  subHours,
  formatDistanceToNow,
} = require("date-fns");
const vi = require("date-fns/locale/vi");
const sendMail = require("../utils/mail");
const { Op } = require("sequelize");

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
      where: {
        endDateTime: { [Op.not]: null }, // endDateTime không null
      },
    });

    for (const mission of missions) {
      const currentTime = new Date();
      const oneDayBeforeEnd = subDays(mission.endDateTime, 1);
      const oneHourBeforeEnd = subHours(currentTime, 1);
      const work = await Work.findByPk(mission.work_id);
      const card = await Card.findByPk(work.card_id);
      const workspace = await Workspace.findByPk(mission.workspace_id);
      const column = card ? await Column.findByPk(card.column_id) : null;
      const board = column ? await Board.findByPk(column.board_id) : null;
      if (workspace && board && mission.user.email && card) {
        const link = `http://localhost:3000/w/${workspace.id}`;

        if (
          isBefore(oneHourBeforeEnd, mission.endDateTime) &&
          isAfter(currentTime, mission.endDateTime)
        ) {
          await mission.update({ status: "expired" });

          const html = `<p>Công việc <b> ${mission.name}</b> của bạn trong Bảng làm việc <b>${board.title}</b>  thuộc Không gian làm việc <a href="${link}">${workspace.name}</a> <span style="color:red">đã hết hạn</span>!</p>`;
          sendMail(mission.user.email, "Thông báo công việc hết hạn", html);
        } else if (
          isAfter(currentTime, oneDayBeforeEnd) &&
          isBefore(currentTime, mission.endDateTime)
        ) {
          await mission.update({ status: "up_expired" });
          // const html = `<p>Công việc <b> ${
          //   mission.name
          // }</b> của bạn trong Bảng làm việc <b>${
          //   board.title
          // }</b>  thuộc Không gian làm việc <a href="${link}">${
          //   workspace.name
          // }</a> <span style="color:red">sắp hết hạn ${formatDistanceToNow(
          //   new Date(card.endDateTime),
          //   {
          //     addSuffix: true,
          //     locale: vi,
          //   }
          // )}</span>!</p>`;
          // sendMail(mission.user.email, "Thông báo công việc hết hạn", html);
        }
      }
    }
  },
};
