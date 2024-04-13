const { Card, Work, Mission } = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
module.exports = {
  index: async (req, res) => {
    const { order = "desc", sort = "created_at", q, card_id } = req.query;
    const filters = {};
    if (card_id) {
      filters.card_id = card_id;
    }
    const options = {
      order: [[sort, order]],
      where: filters,
    };
    const response = {};
    try {
      const works = await Work.findAll(options);
      response.status = 200;
      response.message = "Success";
      response.data = works;
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
      const work = await Work.findByPk(id, {
        include: [
          { model: Card, as: "card" },
          { model: Mission, as: "missions" },
        ],
      });
      if (!work) {
        Object.assign(response, {
          status: 404,
          message: "Not Found",
        });
      } else {
        Object.assign(response, {
          status: 200,
          message: "Success",
          data: work,
        });
      }
    } catch (e) {
      response.status = 500;
      response.message = "Server Error";
    }
    res.status(response.status).json(response);
  },
  store: async (req, res) => {
    const { title, card_id } = req.body;
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

      const card = await Card.findByPk(req.body.card_id);
      if (!card) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      const work = await Work.create(body);

      Object.assign(response, {
        status: 200,
        message: "Success",
        data: work,
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

      // if (method === "PUT") {
      //   body = Object.assign(
      //     {
      //       desc: null,
      //     },
      //     body
      //   );
      // }
      await Work.update(body, {
        where: { id },
      });
      const work = await Work.findByPk(id);
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: work,
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
      const work = await Work.findByPk(id, {
        include: { model: Mission, as: "missions" },
      });

      if (!work) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      const card = await Card.findByPk(work.card_id);
      if (!card) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      if (work.missions.length > 0) {
        await Mission.destroy({ where: { work_id: work.id } });
      }

      await card.removeWork(work);
      await work.destroy();

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
