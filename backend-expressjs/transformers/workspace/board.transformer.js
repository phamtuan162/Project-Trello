const Transformer = require("../../core/Transformer");
const ColumnTransformer = require("./column.transformer");
class BoardTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      workspace_id: instance.workspace_id,
      columnOrderIds: instance.columnOrderIds,
      columns: instance.columns
        ? instance.columns.map((column) => new ColumnTransformer(column))
        : [],
      title: instance.title,
      desc: instance.desc,
      type: instance.type,
      background: instance.background,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
      deletedAt: instance.deleted_at,
    };
  }
}
module.exports = BoardTransformer;
