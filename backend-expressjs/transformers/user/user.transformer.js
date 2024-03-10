const Transformer = require("../../core/Transformer");

class UserTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      name: instance.name,
      phone: instance.phone,
      background: instance.background,
      email: instance.email,
      status: instance.status,
      avatar: instance.avatar,
      providerId: instance.provider_id,
      workspace_id_active: instance.workspace_id_active,
      statusText: instance.status === true ? "Kích hoạt" : "Chưa kích hoạt",
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    };
  }
}
module.exports = UserTransformer;
