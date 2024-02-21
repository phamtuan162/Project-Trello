const Transformer = require("../../core/Transformer");

class CardTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      column_id: instance.column_id,
      title: instance.title,
      desc: instance.desc,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    };
  }
}
module.exports = CardTransformer;
