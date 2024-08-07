const {
  Card,
  Column,
  User,
  Board,
  Work,
  Mission,
  Activity,
  Attachment,
  Comment,
} = require("../../../models/index");
const { object, string, date } = require("yup");
const { Op, Sequelize } = require("sequelize");
const ColumnTransformer = require("../../../transformers/workspace/column.transformer");
module.exports = {
  index: async (req, res) => {
    const { order = "asc", sort = "id", q, board_id } = req.query;
    const filters = {};
    if (board_id) {
      filters.board_id = board_id;
    }
    const options = {
      order: [[sort, order]],
      where: filters,
      include: {
        model: Card,
        as: "cards",
      },
    };
    const response = {};
    try {
      const columns = await Column.findAll(options);
      response.status = 200;
      response.message = "Success";
      response.data = new ColumnTransformer(columns);
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
      const column = await Column.findByPk(id, {
        include: {
          model: Card,
          as: "cards",
        },
      });
      if (!column) {
        Object.assign(response, {
          status: 404,
          message: "Not Found",
        });
      } else {
        Object.assign(response, {
          status: 200,
          message: "Success",
          data: new ColumnTransformer(column),
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

    if (req.body.board_id) {
      rules.board_id = string().required("Chưa có board_id");
    }

    const schema = object(rules);
    const response = {};
    try {
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });
      const column = await Column.create(body);
      const board = await Board.findByPk(column.board_id);

      if (!board) {
        await column.destroy();

        Object.assign(response, {
          status: 404,
          message: "Not found board",
        });
      }
      let updatedColumnOrderIds = [];

      if (board.columnOrderIds === null) {
        updatedColumnOrderIds = [column.id];
      } else {
        updatedColumnOrderIds = board.columnOrderIds.concat(column.id);
      }

      await board.update({
        columnOrderIds: updatedColumnOrderIds,
      });
      await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        column_id: column.id,
        title: column.title,
        action: "add_column",
        workspace_id: user.workspace_id_active,
        desc: `đã thêm danh sách ${column.title} vào bảng ${board.title}`,
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new ColumnTransformer(column),
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
  update: async (req, res) => {
    const { id } = req.params;
    const method = req.method;
    const rules = {};

    if (req.body.title) {
      rules.title = string().required("Chưa nhập tiêu đề");
    }

    const schema = object(rules);
    const response = {};
    //Validate
    try {
      let body = await schema.validate(req.body, {
        abortEarly: false,
      });

      // if (method === "PUT") {
      //   body = Object.assign(
      //     {
      //       desc: null,
      //     },
      //     body
      //   );
      // }
      await Column.update(body, {
        where: { id },
      });
      const column = await Column.findByPk(id, {
        include: {
          model: Card,
          as: "cards",
          include: [
            { model: Comment, as: "comments" },
            { model: Attachment, as: "attachments" },
            {
              model: User,
              as: "users",
            },
            {
              model: Work,
              as: "works",
              include: { model: Mission, as: "missions" },
            },
          ],
        },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new ColumnTransformer(column),
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
      const column = await Column.findByPk(id, {
        include: { model: Card, as: "cards" },
      });

      const board = await Board.findByPk(column.board_id);
      if (!column || !board) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      const title = column.title;
      const columnOrderIdsUpdate = board.columnOrderIds.filter(
        (item) => +item !== +column.id
      );
      if (column.cards.length > 0) {
        for (const card of column.cards) {
          await card.update({ column_id: null });
          await card.destroy();
        }
      }
      await column.update({ board_id: null });
      await column.destroy();
      await board.update({ columnOrderIds: columnOrderIdsUpdate });

      await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        column_id: column.id,
        title: title,
        action: "delete_column",
        workspace_id: user.workspace_id_active,
        desc: `đã xóa danh sách ${title} ra khỏi bảng ${board.title}`,
      });

      Object.assign(response, {
        status: 200,
        message: "Success",
      });
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
      });
    }

    res.status(response.status).json(response);
  },

  moveCardDiffBoard: async (req, res) => {
    const { user_id, card_id, activeColumn, overColumn } = req.body;
    const response = {};

    if (
      !user_id ||
      !card_id ||
      !overColumn.cardOrderIds ||
      !activeColumn.cardOrderIds
    ) {
      return res.status(400).json({ status: 400, message: "Bad request" });
    }

    try {
      const card = await Card.findByPk(card_id, {
        include: {
          model: User,
          as: "users",
        },
      });
      if (!card) {
        return res.status(404).json({ status: 404, message: "Not found Card" });
      }

      const columnOfActive = await Column.findByPk(activeColumn.id);
      const columnOfOver = await Column.findByPk(overColumn.id);

      if (!columnOfActive || !columnOfOver) {
        return res
          .status(404)
          .json({ status: 404, message: "Not found Column" });
      }

      await card.update({ column_id: columnOfOver.id });
      if (card.users) {
        for (const user of card.users) {
          if (+user.id !== +user_id) {
            await card.removeUser(user);
          }
        }
      }
      await Promise.all([
        columnOfActive.update({ cardOrderIds: activeColumn.cardOrderIds }),
        columnOfOver.update({ cardOrderIds: overColumn.cardOrderIds }),
      ]);

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

  moveColumnDiffBoard: async (req, res) => {
    const { id } = req.params;
    const { boardActive, boardOver, user_id } = req.body;
    const response = {};
    try {
      if (
        !boardActive.columnOrderIds ||
        !boardOver.columnOrderIds ||
        !user_id
      ) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }

      const column = await Column.findByPk(id, {
        include: { model: Card, as: "cards" },
      });
      const BoardNew = await Board.findByPk(boardOver.id);
      const BoardOld = await Board.findByPk(boardActive.id);
      if (!column || !BoardNew || !BoardOld) {
        return res.status(404).json({ status: 404, message: "Not Found" });
      }
      await column.update({ board_id: BoardNew.id });
      await BoardOld.update({ columnOrderIds: boardActive.columnOrderIds });
      await BoardNew.update({ columnOrderIds: boardOver.columnOrderIds });
      if (column.cards.length > 0) {
        for (const card of column.cards) {
          const cardUpdate = await Card.findByPk(card.id, {
            include: [
              { model: User, as: "users" },
              { model: Work, as: "works" },
            ],
          });
          if (cardUpdate.users.length > 0) {
            for (const user of cardUpdate.users) {
              const userInstance = await User.findByPk(user.id);
              if (+user.id !== +user_id && userInstance) {
                cardUpdate.removeUser(userInstance);
              }
            }
          }
          if (cardUpdate.works.length > 0) {
            for (const work of cardUpdate.works) {
              const workUpdate = await Work.findByPk(work.id, {
                include: { model: Mission, as: "missions" },
              });
              if (workUpdate.missions.length > 0) {
                for (const mission of workUpdate.missions) {
                  if (mission.user_id && +mission.user_id !== +user_id) {
                    await Mission.update(
                      { where: { id: mission.id } },
                      { user_id: user_id }
                    );
                  }
                }
              }
            }
          }
        }
      }
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

  copyColumn: async (req, res) => {
    const user = req.user.dataValues;
    const { column, board_id, title } = req.body;
    const response = {};
    let transaction;

    try {
      if (!column || !board_id) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }

      const BoardActive = await Board.findByPk(board_id);
      if (!column || !BoardActive) {
        return res.status(404).json({ status: 404, message: "Not Found" });
      }

      const columnNew = await Column.create({
        title: title,
        board_id: board_id,
        order: column.order,
      });
      const newColumnOrderIds = [columnNew.id, ...BoardActive.columnOrderIds];
      await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        column_id: columnNew.id,
        title: title,
        action: "add_column",
        workspace_id: user.workspace_id_active,
        desc: `đã thêm danh sách ${title} vào bảng ${BoardActive.title}`,
      });
      if (column.cards.length > 0) {
        let cardOrderIdsNew = [];

        for (const card of column.cards) {
          const cardNew = await Card.create({
            column_id: columnNew.id,
            title: card.title,
            desc: card.desc,
            background: card.background,
            startDateTime: card.startDateTime,
            endDateTime: card.endDateTime,
            status: card.status,
          });
          await Activity.create({
            user_id: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            card_id: cardNew.id,
            title: cardNew.title,
            action: "copy_card",
            workspace_id: user.workspace_id_active,
            desc: `đã sao chép thẻ này từ ${card.title} trong danh sách ${column.title}`,
          });

          cardOrderIdsNew.push(cardNew.id);
          if (card.users.length > 0) {
            card.users.sort((a, b) =>
              a === user.id ? -1 : b === user.id ? 1 : 0
            );
            for (const userCopy of card.users) {
              const userInstance = await User.findByPk(userCopy.id);
              if (userInstance) {
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
                    +userInstance.id === +user.id
                      ? ` đã tham gia thẻ này`
                      : ` đã thêm ${userInstance.name} vào thẻ này`,
                });
              }
            }
          }

          if (card.works.length > 0) {
            for (const work of card.works) {
              const workNew = await Work.create(
                {
                  title: work.title,
                  card_id: cardNew.id,
                },
                { transaction }
              );
              if (work.missions.length > 0) {
                for (const mission of work.missions) {
                  await Mission.create({
                    name: mission.name,
                    work_id: workNew.id,
                    user_id: mission.user_id,
                    status: mission.status,
                    endDateTime: mission.endDateTime,
                  });
                }
              }
            }
          }

          if (card.attachments.length > 0) {
            for (const attachment of card.attachments) {
              await Attachment.create({
                fileName: attachment.fileName,
                path: attachment.path,
                created_at: attachment.created_at,
                updated_at: attachment.updated_at,
                card_id: cardNew.id,
                user_id: attachment.user_id,
              });
            }
          }
          if (card.comments.length > 0) {
            for (const comment of card.comments) {
              await Comment.create({
                isEdit: comment.isEdit,
                userName: comment.userName,
                userAvatar: comment.userAvatar,
                user_id: comment.user_id,
                card_id: cardNew.id,
                content: comment.content,
              });
            }
          }
        }
        await columnNew.update({ cardOrderIds: cardOrderIdsNew });
      }
      await BoardActive.update({
        columnOrderIds: newColumnOrderIds,
      });

      const columnUpdate = await Column.findByPk(columnNew.id, {
        include: {
          model: Card,
          as: "cards",
          include: [
            { model: Comment, as: "comments" },
            { model: Attachment, as: "attachments" },
            {
              model: User,
              as: "users",
            },
            {
              model: Work,
              as: "works",
              include: { model: Mission, as: "missions" },
            },
          ],
        },
      });

      Object.assign(response, {
        status: 200,
        message: "Success",
        data: columnUpdate,
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
};
