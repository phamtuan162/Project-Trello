const Transformer = require("../../core/Transformer");
const BoardTransformer = require("./board.transformer");
const UserTransformer = require("../user/user.transformer");

class WorkspaceTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      color: instance.color,
      userId: instance.user_id,
      name: instance.name,
      desc: instance.desc,
      boards: instance.boards
        ? instance.boards.map((board) => new BoardTransformer(board))
        : [],
      users: instance.users
        ? instance.users.map((user) => new UserTransformer(user.dataValues))
        : [],
      isActive: instance.isActive,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    };
  }
}
module.exports = WorkspaceTransformer;
