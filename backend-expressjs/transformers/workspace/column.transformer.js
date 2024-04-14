const Transformer = require("../../core/Transformer");
const CardTransformer = require("./card.transformer");
class ColumnTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      board_id: instance.board_id,
      title: instance.title,
      cardOrderIds: instance.cardOrderIds,
      cards: instance.cards || [],
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    };
  }
}
module.exports = ColumnTransformer;
