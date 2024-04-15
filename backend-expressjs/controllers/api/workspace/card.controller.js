const { Card, Column, User, Work, Mission } = require("../../../models/index");
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
      const card = await Card.findByPk(id, {
        include: [
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
    const { title } = req.body;
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
      const card = await Card.findByPk(id, {
        include: { model: User, as: "users" },
      });
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
    const response = {};

    try {
      const card = await Card.findByPk(id, {
        include: [
          { model: User, as: "users" },
          { model: Work, as: "works" },
        ],
      });
      const column = await Column.findByPk(card.column_id);
      if (card && column) {
        const cardOrderIdsUpdate = column.cardOrderIds.filter(
          (item) => +item !== +card.id
        );
        await column.update({ cardOrderIds: cardOrderIdsUpdate });

        if (card.works.length > 0) {
          await Work.destroy({ where: { card_id: card.id } });
        }
        await card.removeUsers(card.users);

        await card.destroy();

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
  assignUser: async (req, res) => {
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

    const cardAssignedUser = await Card.findByPk(id, {
      include: { model: User, as: "users" },
    });
    Object.assign(response, {
      status: 200,
      message: "Success",
      card: new CardTransformer(cardAssignedUser),
    });
    res.status(response.status).json(response);
  },
  unAssignUser: async (req, res) => {
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
    const cardAssignedUser = await Card.findByPk(id, {
      include: { model: User, as: "users" },
    });
    Object.assign(response, {
      status: 200,
      message: "Success",
      card: new CardTransformer(cardAssignedUser),
    });
    res.status(response.status).json(response);
  },
  copyCard: async (req, res) => {
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

      const cardNew = await Card.create(card);
      if (cardNew && card.users.length > 0 && keptItems.length > 0) {
        for (const keptItem of keptItems) {
          const itemType = keptItem.toLowerCase();
          switch (itemType) {
            case "users":
              if (matchBoard) {
                for (const user of card.users) {
                  const userInstance = await User.findByPk(user.id);
                  await cardNew.addUser(userInstance);
                }
              } else {
                const user = await User.findByPk(user_id);
                await cardNew.addUser(user);
              }
              break;
            case "comments":
              // Xử lý trường hợp cho comments nếu cần
              break;
            default:
              // Xử lý các trường hợp khác nếu cần
              break;
          }
        }
      }

      await column.update({ cardOrderIds: overColumn.cardOrderIds });

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
