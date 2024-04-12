const { Card, Column, User, Board } = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
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
    const { id } = req.params;
    const response = {};
    try {
      const column = await Column.findByPk(id, {
        include: { model: Card, as: "cards" },
      });
      if (column) {
        for (const card of column.cards) {
          const cardDelete = await Card.findByPk(card.id, {
            include: { model: User, as: "users" },
          });

          if (cardDelete.users.length > 0) {
            await cardDelete.removeUsers(cardDelete.users);
          }
          await cardDelete.destroy();
        }
        await Column.destroy({ where: { id } });
        Object.assign(response, {
          status: 200,
          message: "Success",
        });
      }
    } catch (error) {
      Object.assign(response, {
        status: 500,
        message: "Sever error",
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
};
