const { Mission, Work, User, Card, Column } = require("../../../models/index");
const { object, string } = require("yup");
const { Op } = require("sequelize");
const CardTransformer = require("../../../transformers/workspace/card.transformer");

module.exports = {
  index: async (req, res) => {
    const { order = "desc", sort = "created_at", q, work_id } = req.query;
    const filters = {};
    if (work_id) {
      filters.work_id = work_id;
    }
    const options = {
      order: [[sort, order]],
      where: filters,
    };
    const response = {};
    try {
      const missions = await Mission.findAll(options);
      response.status = 200;
      response.message = "Success";
      response.data = missions;
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
      const mission = await Mission.findByPk(id, {
        include: { model: Work, as: "work" },
      });
      if (!mission) {
        Object.assign(response, {
          status: 404,
          message: "Not Found",
        });
      } else {
        Object.assign(response, {
          status: 200,
          message: "Success",
          data: mission,
        });
      }
    } catch (e) {
      response.status = 500;
      response.message = "Server Error";
    }
    res.status(response.status).json(response);
  },
  store: async (req, res) => {
    const { name, work_id } = req.body;
    const rules = {};

    if (req.body.title) {
      rules.title = string().required("Chưa nhập tên");
    }

    const schema = object(rules);
    const response = {};
    try {
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });

      const work = await Work.findByPk(req.body.work_id);
      if (!work) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      const mission = await Mission.create(body);

      Object.assign(response, {
        status: 200,
        message: "Success",
        data: mission,
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

    if (req.body.name) {
      rules.name = string().required("Chưa nhập tên");
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
      await Mission.update(body, {
        where: { id },
      });
      const mission = await Mission.findByPk(id);
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: mission,
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
      const mission = await Mission.findByPk(id);
      if (!mission) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }
      const work = await Work.findByPk(mission.work_id);

      if (!work) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      await work.removeMission(mission);
      await mission.destroy();

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
  transferCard: async (req, res) => {
    const { id } = req.params;
    const { column_id } = req.body;
    const response = {};
    try {
      if (!column_id) {
        return res.status(400).json({ status: 400, message: "Bad request" });
      }
      const mission = await Mission.findByPk(id);
      if (!mission) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      const column = await Column.findByPk(column_id);
      if (!column) {
        return res.status(404).json({ status: 404, message: "Not found" });
      }

      const card = await Card.create({
        title: mission.name,
        endDateTime: mission.endDateTime,
        column_id: column_id,
        status: mission.status,
      });

      if (mission.user_id) {
        const user = await User.findByPk(mission.user_id);
        await card.addUser(user);
      }

      await column.update({ cardOrderIds: [...column.cardOrderIds, card.id] });
      await mission.destroy();

      const CardNew = await Card.findByPk(card.id, {
        include: { model: User, as: "users" },
      });
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: new CardTransformer(CardNew),
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
