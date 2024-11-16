const {
  Workspace,
  Board,
  Column,
  Card,
  User,
  Work,
  Mission,
  Activity,
  Attachment,
  Comment,
} = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
const BoardTransformer = require("../../../transformers/workspace/board.transformer");

module.exports = {
  index: async (req, res) => {
    const {
      order = "desc",
      sort = "updated_at",
      status,
      workspace_id,
      q,
    } = req.query;
    const filters = {};
    if (status) {
      filters.status = status;
    }
    if (workspace_id) {
      filters.workspace_id = workspace_id;
    }
    const options = {
      paranoid: true,
      order: [[sort, order]],
      where: filters,
      include: {
        model: Column,
        as: "columns",
        include: {
          model: Card,
          as: "cards",
        },
      },
    };
    const response = {};
    try {
      const boards = await Board.findAll(options);
      response.status = 200;
      response.message = "Success";
      response.data = new BoardTransformer(boards);
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
      const board = await Board.findByPk(id, {
        include: {
          model: Column,
          as: "columns",
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
        },
        paranoid: true,
      });
      if (!board) {
        Object.assign(response, {
          status: 404,
          message: "Not Found",
        });
      } else {
        Object.assign(response, {
          status: 200,
          message: "Success",
          data: new BoardTransformer(board),
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

    if (req.body.status) {
      rules.status = string().required("Chọn trạng thái");
    }

    const schema = object(rules);

    const response = {};
    try {
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });
      const board = await Board.create({ ...body, status: "public" });
      const activity = await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        board_id: board.id,
        title: board.title,
        action: "add_board",
        workspace_id: user.workspace_id_active,
        desc: `đã thêm bảng ${board.title} vào Không gian làm việc này`,
      });

      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new BoardTransformer(board),
        activity: activity,
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
    if (req.body.status) {
      rules.status = string().required("Chọn trạng thái");
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
      await Board.update(body, {
        where: { id },
      });
      const board = await Board.findByPk(id, {
        include: {
          model: Column,
          as: "columns",
          include: {
            model: Card,
            as: "cards",
          },
        },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new BoardTransformer(board),
      });
    } catch (e) {
      const errors = Object.fromEntries(
        e?.inner?.map(({ path, message }) => [path, message])
      );
      Object.assign(response, {
        status: 400,
        message: "Bad Request",
        errors,
      });
    }
    res.status(response.status).json(response);
  },

  moveCard: async (req, res) => {
    const user = req.user.dataValues;
    const { id } = req.params;
    const { updateBoard, card_id, prevColumnId, nextColumnId } = req.body;
    const response = {};
    try {
      const columns = updateBoard.columns;
      if (!columns.length > 0 || !card_id || !prevColumnId || !nextColumnId) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }
      const cardCurrent = await Card.findByPk(card_id);
      const nextColumn = await Column.findByPk(nextColumnId);
      const prevColumn = await Column.findByPk(prevColumnId);

      if (!cardCurrent || !nextColumn || !prevColumn) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      if (nextColumn.cardOrderIds.find((item) => +item === +card_id)) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      for (const column of columns) {
        const cards = column.cards;
        if (+column.id === prevColumnId || +column.id === +nextColumnId) {
          await Column.update(
            {
              cardOrderIds: column.cardOrderIds,
            },
            { where: { id: column.id } }
          );
        }

        for (const card of cards) {
          if (+card.id === card_id) {
            await Card.update(
              { column_id: card.column_id },
              {
                where: {
                  id: card.id,
                },
              }
            );
          }
        }
      }

      const activity = await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        card_id: cardCurrent.id,
        title: cardCurrent.title,
        action: "move_card",
        workspace_id: user.workspace_id_active,
        desc: `đã di chuyển thẻ này từ danh sách ${prevColumn.title} tới danh sách ${nextColumn.title}`,
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: activity,
      });
    } catch (e) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
      });
    }
    res.status(response.status).json(response);
  },

  delete: async (req, res) => {
    const user = req.user.dataValues;
    const { id } = req.params;
    const response = {};
    const board = await Board.findByPk(id);
    if (!board) {
      return res.status(404).json({ status: 404, message: "Not found" });
    }
    try {
      const title = board.title;

      await board.destroy();

      await Activity.create({
        user_id: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        board_id: 9999,
        title: title,
        action: "add_board",
        workspace_id: user.workspace_id_active,
        desc: `đã xóa bảng ${board.title} ra khỏi Không gian làm việc này`,
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
};
