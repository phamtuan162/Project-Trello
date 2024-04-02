const Transformer = require("../../core/Transformer");

class CardTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      column_id: instance.column_id,
      title: instance.title,
      users: instance.users || [],
      desc: instance.desc,
      background: instance.background,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    };
  }
}
module.exports = CardTransformer;
