const Transformer = require("../core/Transformer");
const ColumnTransformer = require("./column.transformer");
class BoardTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      workspace_id: instance.workspace_id,
      columnOrderIds: instance.columnOrderIds,
      columns: new ColumnTransformer(instance.columns),
      title: instance.title,
      desc: instance.desc,
      type: instance.type,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
      deletedAt: instance.deleted_at,
    };
  }
}
module.exports = BoardTransformer;
