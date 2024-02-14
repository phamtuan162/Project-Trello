const { Column, Card } = require("../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
const ColumnTransformer = require("../../transformers/column.transformer");

module.exports = {
  index: async (req, res) => {
    const { order = "asc", sort = "id", q } = req.query;
    const filters = {};
    const options = {
      order: [[sort, order]],
      where: filters,
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
      const column = await Column.findByPk(id);
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
    const schema = object({
      title: string().required("Chưa nhập tiêu đề column"),
    });
    const response = {};
    try {
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });
      const column = await Column.create(body);

      Object.assign(response, {
        status: 201,
        message: "Success",
        data: new ColumnTransformer(column),
      });
    } catch (e) {
      const errors = Object.fromEntries(
        e.inner.map(({ path, message }) => [path, message])
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

      if (method === "PUT") {
        body = Object.assign(
          {
            desc: null,
          },
          body
        );
      }
      await Column.update(body, {
        where: { id },
      });
      const column = await Column.findByPk(id);
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new ColumnTransformer(column),
      });
    } catch (e) {
      const errors = Object.fromEntries(
        e.inner.map(({ path, message }) => [path, message])
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
      const column = await Column.findByPk(id);
      if (column) {
        await Card.destroy({ where: { column_id: column.id } });
        await column.destroy();
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
