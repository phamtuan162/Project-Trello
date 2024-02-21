const { Card, Column } = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
const CardTransformer = require("../../../transformers/workspace/card.transformer");

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
      const card = await Card.findByPk(id);
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
    const { title } = req.body;
    const rules = {};

    if (req.body.title) {
      rules.title = string().required("Chưa nhập tiêu đề");
    }

    if (req.body.column_id) {
      rules.title = string().required("Chưa có column_id");
    }

    const schema = object(rules);
    const response = {};
    try {
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });
      const card = await Card.create(body);
      const column = await Column.findByPk(req.body.column_id);

      if (!column) {
        await card.destroy();

        Object.assign(response, {
          status: 404,
          message: "Not found Column",
        });
      }

      let updatedCardOrderIds = [];

      if (column.cardOrderIds === null) {
        updatedCardOrderIds = [card.id];
      } else {
        updatedCardOrderIds = column.cardOrderIds.concat(card.id);
      }
      await column.update({
        cardOrderIds: updatedCardOrderIds,
      });

      Object.assign(response, {
        status: 201,
        message: "Success",
        data: new CardTransformer(card),
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
      await Card.update(body, {
        where: { id },
      });
      const card = await Card.findByPk(id);
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new CardTransformer(card),
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
    try {
      const card = await Card.findByPk(id);
      if (card) {
        await card.destroy();
        res.status(204).json({
          status: 204,
          message: "Success",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
      });
    }
  },
};
