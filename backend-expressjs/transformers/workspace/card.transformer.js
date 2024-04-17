const Transformer = require("../../core/Transformer");
const UserTransformer = require("../user/user.transformer");

class CardTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      column_id: instance.column_id,
      title: instance.title,
      users: instance.users
        ? instance.users.map((user) => new UserTransformer(user.dataValues))
        : [],
      works: instance.works || [],
      column: instance.column || [],
      desc: instance.desc,
      status: instance.status,
      startDateTime: instance.startDateTime,
      endDateTime: instance.endDateTime,
      background: instance.background,
      created_at: instance.created_at,
      updated_at: instance.updated_at,
    };
  }
}
module.exports = CardTransformer;
