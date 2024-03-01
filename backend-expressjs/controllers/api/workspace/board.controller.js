const { Board, Column, Card } = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
const BoardTransformer = require("../../../transformers/workspace/board.transformer");

module.exports = {
  index: async (req, res) => {
    const { order = "asc", sort = "updated_at", workspace_id, q } = req.query;
    const filters = {};
    if (workspace_id) {
      filters.workspace_id = workspace_id;
    }
    const options = {
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
          },
        },
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
      const board = await Board.create(body);

      Object.assign(response, {
        status: 201,
        message: "Success",
        data: new BoardTransformer(board),
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
  moveCard: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const response = {};
    try {
      const columns = data.columns;
      const board = await Board.findByPk(id);
      if (!board) {
        Object.assign(response, {
          status: 404,
          message: "Not Found",
        });
      }

      for (const column of columns) {
        const cards = column.cards;
        await Column.update(
          {
            cardOrderIds: column.cardOrderIds,
          },
          { where: { id: column.id } }
        );
        for (const card of cards) {
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

      await board.update({ columnOrderIds: data.columnOrderIds });

      Object.assign(response, {
        status: 200,
        message: "Success",
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
    const { id } = req.params;
    try {
      const columns = await Column.findAll({ where: { board_id: id } });

      for (const column of columns) {
        await Card.destroy({ where: { column_id: column.id } });
      }
      await Column.destroy({ where: { board_id: id } });

      await Board.destroy({ where: { id }, force: true });

      res.status(204).json({
        status: 204,
        message: "Success",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  },
};
