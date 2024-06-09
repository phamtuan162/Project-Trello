const {
  Board,
  Card,
  Column,
  User,
  Work,
  Mission,
  Activity,
  Attachment,
  Workspace,
  Comment,
} = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
const CardTransformer = require("../../../transformers/workspace/card.transformer");
const { format } = require("date-fns");
const workspace = require("../../../models/workspace");
module.exports = {
  index: async (req, res) => {
    const { order = "asc", sort = "id", q, column_id } = req.query;
    const filters = {};
    if (column_id) {
      filters.column_id = column_id;
    }
    const options = {
      order: [[sort, order]],
      where: filters,
    };
    const response = {};
    try {
      const cards = await Card.findAll(options);
      response.status = 200;
      response.message = "Success";
      response.data = new CardTransformer(cards);
    } catch (e) {
      response.status = 500;
      response.message = "Server error";
    }

    res.status(response.status).json(response);
  },
  find: async (req, res) => {
    const { id } = req.params;
    const response = {};
    try {
      const card = await Card.findByPk(id, {
        include: [
          { model: Comment, as: "comments" },
          { model: Attachment, as: "attachments" },
          { model: Activity, as: "activities" },
          { model: User, as: "users" },
          { model: Column, as: "column" },
          {
            model: Work,
            as: "works",
            include: {
              model: Mission,
              as: "missions",
              include: {
                model: User,
                as: "user",
              },
            },
          },
        ],
      });
      if (!card) {
        Object.assign(response, {
          status: 404,
          message: "Not Found",
        });
      } else {
        Object.assign(response, {
          status: 200,
          message: "Success",
          data: new CardTransformer(card),
        });
      }
    } catch (e) {
      response.status = 500;
      response.message = "Server Error";
    }
    res.status(response.status).json(response);
  },
  store: async (req, res) => {
    const user = req.user.dataValues;

    const rules = {};
    if (req.body.title) {
      rules.title = string().required("Chưa nhập tiêu đề");
    }

    const schema = object(rules);
    const response = {};
    try {
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });
      const column = await Column.findByPk(req.body.column_id);
      const workspace = await Workspace.findByPk(req.body.workspace_id);
      if (!column || !workspace) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      const card = await Card.create(body);

      let updatedCardOrderIds = [];

      if (column.cardOrderIds === null) {
        updatedCardOrderIds = [card.id];
      } else {
        updatedCardOrderIds = column.cardOrderIds.concat(card.id);
      }
      await column.update({
        cardOrderIds: updatedCardOrderIds,
      });
      await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        card_id: card.id,
        title: card.title,
        action: "create",
        workspace_id: user.workspace_id_active,
        desc: `vào danh sách ${column.title}`,
      });

      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new CardTransformer(card),
      });
    } catch (e) {
      // const errors = Object.fromEntries(
      //   e?.inner.map(({ path, message }) => [path, message])
      // );
      console.log(e);
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        e,
      });
    }
    res.status(response.status).json(response);
  },
  update: async (req, res) => {
    const user = req.user.dataValues;
    const { id } = req.params;
    const method = req.method;
    const rules = {};

    if (req.body.title) {
      rules.title = string().required("Chưa nhập tiêu đề");
    }

    const schema = object(rules);
    const response = {};
    try {
      let body = await schema.validate(req.body, {
        abortEarly: false,
      });
      const card = await Card.findByPk(id);
      if (!card) {
        return res.status(404).json({ status: 404, message: "Not found card" });
      }
      await card.update(body);

      if (req.body.status) {
        await Activity.create({
          user_id: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          card_id: id,
          title: card.title,
          action: "status_card",
          workspace_id: user.workspace_id_active,
          desc:
            req.body.status.toLowerCase() === "success"
              ? "đã đánh dấu ngày hết hạn là hoàn thành"
              : "đã đánh dấu ngày hết hạn là chưa hoàn thành",
        });
      }
      const cardUpdate = await Card.findByPk(id, {
        include: [
          { model: User, as: "users" },
          { model: Activity, as: "activities" },
        ],
      });

      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new CardTransformer(cardUpdate),
      });
    } catch (e) {
      const errors = Object.fromEntries(
        e?.inner.map(({ path, message }) => [path, message])
      );
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        errors,
      });
    }
    res.status(response.status).json(response);
  },
  delete: async (req, res) => {
    const user = req.user.dataValues;
    const { id } = req.params;
    const response = {};

    try {
      const card = await Card.findByPk(id);
      const column = await Column.findByPk(card.column_id);
      if (!card || !column) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      const title = card.title;
      await card.destroy();
      await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        card_id: card.id,
        title: title,
        action: "delete",
        workspace_id: user.workspace_id_active,
        desc: `đã xóa thẻ ${card.title} khỏi danh sách ${column.title}`,
      });

      Object.assign(response, {
        status: 200,
        message: "Success",
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Sever error",
      });
    }
    res.status(response.status).json(response);
  },
  assignUser: async (req, res) => {
    const userMain = req.user.dataValues;
    const { id } = req.params;
    const { user_id } = req.body;
    const response = {};
    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).json({ status: 404, message: "Not found card" });
    }
    if (!user_id) {
      return res.status(400).json({ status: 400, message: "Bad request" });
    }
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "Not found user" });
    }
    await card.addUser(user);
    await Activity.create({
      user_id: userMain.id,
      userName: userMain.name,
      userAvatar: userMain.avatar,
      card_id: card.id,
      title: card.title,
      action: "assign_user",
      workspace_id: userMain.workspace_id_active,
      desc:
        +userMain.id === +user_id ? `đã tham gia` : `đã thêm ${user.name} vào`,
    });
    const cardAssignedUser = await Card.findByPk(id, {
      include: [
        { model: User, as: "users" },
        { model: Activity, as: "activities" },
      ],
    });
    Object.assign(response, {
      status: 200,
      message: "Success",
      card: new CardTransformer(cardAssignedUser),
    });
    res.status(response.status).json(response);
  },
  unAssignUser: async (req, res) => {
    const userMain = req.user.dataValues;
    const { id } = req.params;
    const { user_id } = req.body;
    const response = {};
    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).json({ status: 404, message: "Not found card" });
    }
    if (!user_id) {
      return res.status(400).json({ status: 400, message: "Bad request" });
    }
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "Not found user" });
    }

    await card.removeUser(user);
    await Activity.create({
      user_id: userMain.id,
      userName: userMain.name,
      userAvatar: userMain.avatar,
      card_id: card.id,
      title: card.title,
      action: "un_assign_user",
      workspace_id: userMain.workspace_id_active,
      desc:
        +userMain.id === +user_id ? `đã rời khỏi` : `đã loại ${user.name} khỏi`,
    });
    const cardAssignedUser = await Card.findByPk(id, {
      include: [
        { model: User, as: "users" },
        { model: Activity, as: "activities" },
      ],
    });
    Object.assign(response, {
      status: 200,
      message: "Success",
      card: new CardTransformer(cardAssignedUser),
    });
    res.status(response.status).json(response);
  },
  copyCard: async (req, res) => {
    const user = req.user.dataValues;
    const { keptItems, user_id, matchBoard, overColumn, card } = req.body;
    const response = {};
    try {
      if (!keptItems || !user_id || !overColumn.cardOrderIds || !card) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }
      const column = await Column.findByPk(overColumn.id);

      if (!column) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      const cardNew = await Card.create({
        id: card.id,
        workspace_id: card.workspace_id,
        column_id: card.column_id,
        title: card.title,
        desc: card.desc,
        background: card.background,
        startDateTime: card.startDateTime,
        endDateTime: card.endDateTime,
        status: "pending",
      });
      if (cardNew && keptItems.length > 0) {
        await Promise.all(
          keptItems.map(async (keptItem) => {
            const itemType = keptItem.toLowerCase().trim();
            switch (itemType) {
              case "users":
                const usersToAdd = matchBoard
                  ? card.users.map((user) => user.id)
                  : [user_id];
                usersToAdd.sort((a, b) =>
                  a === user_id ? -1 : b === user_id ? 1 : 0
                );

                await Promise.all(
                  usersToAdd.map(async (userId) => {
                    const userInstance = await User.findByPk(userId);
                    await cardNew.addUser(userInstance);
                    await Activity.create({
                      user_id: user.id,
                      userName: user.name,
                      userAvatar: user.avatar,
                      card_id: cardNew.id,
                      title: cardNew.title,
                      action: "assign_user",
                      workspace_id: user.workspace_id_active,
                      desc:
                        +userId === +user_id
                          ? "đã tham gia thẻ này"
                          : `đã thêm ${userInstance.name} vào thẻ này`,
                    });
                    return userInstance;
                  })
                );

                break;
              case "works":
                await Promise.all(
                  card.works.map(async (work) => {
                    const workNew = await Work.create({
                      title: work.title,
                      card_id: cardNew.id,
                    });
                    if (work.missions.length > 0) {
                      await Promise.all(
                        work.missions.map(async (mission) => {
                          const missionNew = await Mission.create({
                            name: mission.name,
                            work_id: workNew.id,
                            workspace_id: user.workspace_id_active,
                            user_id: matchBoard ? mission.user_id : user_id,
                            status: "pending",
                            endDateTime: mission.endDateTime,
                          });
                          return missionNew;
                        })
                      );
                    }
                    return workNew;
                  })
                );
                break;
              case "attachments":
                await Promise.all(
                  card.attachments.map(async (attachment) => {
                    const attachmentNew = await Attachment.create({
                      fileName: attachment.fileName,
                      path: attachment.path,

                      card_id: cardNew.id,
                      user_id: attachment.user_id,
                    });

                    return attachmentNew;
                  })
                );
                break;
              case "comments":
                await Promise.all(
                  card.comments.map(async (comment) => {
                    const activity = await Activity.create({
                      user_id: user.id,
                      userName: user.name,
                      userAvatar: user.avatar,
                      card_id: cardNew.id,
                      title: comment.content,
                      action: "copy_comment",
                      workspace_id: user.workspace_id_active,
                      desc: `đã sao chép bình luận của ${comment.userName} từ thẻ ${card.title}`,
                    });
                    return activity;
                  })
                );
                break;
              default:
                // Xử lý các trường hợp khác nếu cần
                break;
            }
          })
        );
      }

      await column.update({ cardOrderIds: overColumn.cardOrderIds });
      const oldColumn =
        +card.column_id === +overColumn.id
          ? overColumn
          : await Column.findByPk(card.column_id);
      const board = !matchBoard && (await Board.findByPk(overColumn.board_id));
      await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        card_id: cardNew.id,
        title: cardNew.title,
        action: "copy_card",
        workspace_id: user.workspace_id_active,
        desc: `đã sao chép thẻ này từ ${card.title} trong danh sách ${
          oldColumn.title
        } ${!matchBoard ? board.title : ""}`,
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
      });
    } catch (error) {
      console.log(error);
      Object.assign(response, {
        status: 500,
        message: "Sever error",
      });
    }

    res.status(response.status).json(response);
  },

  dateCard: async (req, res) => {
    const user = req.user.dataValues;
    const { id } = req.params;
    const { endDateTime, startDateTime } = req.body;
    const response = {};
    try {
      const card = await Card.findByPk(id);
      if (!card) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      await card.update(req.body);

      if (endDateTime) {
        const endDateTimeUpdate = format(
          new Date(card.endDateTime),
          "'Ngày' d 'tháng' M 'lúc' H:mm"
        );
        await Activity.create({
          user_id: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          card_id: card.id,
          title: card.title,
          action: "date_card",
          workspace_id: user.workspace_id_active,
          desc: card.endDateTime
            ? `đã chuyển ngày hết hạn thẻ ${card.title} sang ${endDateTimeUpdate}`
            : `đã đặt ngày hết hạn cho thẻ ${card.title} là ${endDateTimeUpdate}`,
        });
      }
      if (endDateTime === null) {
        await Activity.create({
          user_id: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          card_id: card.id,
          title: card.title,
          action: "date_card",
          workspace_id: user.workspace_id_active,
          desc: `đã bỏ ngày hết hạn của thẻ này`,
        });
      }
      const cardUpdate = await Card.findByPk(id, {
        include: [
          { model: User, as: "users" },
          { model: Activity, as: "activities" },
        ],
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new CardTransformer(cardUpdate),
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Sever error",
      });
    }

    res.status(response.status).json(response);
  },

  uploads: async (req, res) => {
    const { id } = req.params;
    const user = req.user.dataValues;
    const { name } = req.body;
    const file = req.file;
    const path = `http://localhost:3001/uploads/${file.filename}`;
    const response = {};
    try {
      const card = await Card.findByPk(id);

      if (!card) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      const attachment = await Attachment.create({
        user_id: user.id,
        path: path,
        card_id: card.id,
        fileName: name,
      });

      await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        card_id: card.id,
        title: card.title,
        action: "attachment_file",
        workspace_id: user.workspace_id_active,
        desc: `đã đính kèm tập tin ${name} vào thẻ này`,
      });

      const cardUpdate = await Card.findByPk(id, {
        include: [
          { model: Activity, as: "activities" },
          { model: Attachment, as: "attachments" },
        ],
      });

      Object.assign(response, {
        status: 200,
        message: "Success",
        data: cardUpdate,
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
      });
    }
    res.status(response.status).json(response);
  },
};
