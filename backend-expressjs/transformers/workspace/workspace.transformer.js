const Transformer = require("../../core/Transformer");

class WorkspaceTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      userId: instance.user_id,
      name: instance.name,
      desc: instance.desc,
      boards: instance.boards,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    };
  }
}
module.exports = WorkspaceTransformer;
