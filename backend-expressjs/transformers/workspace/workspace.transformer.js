const Transformer = require("../../core/Transformer");

class WorkspaceTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      color: instance.color,
      userId: instance.user_id,
      name: instance.name,
      desc: instance.desc,
      boards: instance.boards,
      isActive: instance.isActive,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    };
  }
}
module.exports = WorkspaceTransformer;
