var express = require("express");
var router = express.Router();
const workspaceController = require("../../../controllers/api/workspace/workspace.controller");
const permission = require("../../../middlewares/api/permission.middleware");

router.get("/", workspaceController.index);
router.get("/:id", permission("workspace.read"), workspaceController.find);
router.post("/", workspaceController.store);
router.post(
  "/invite",
  permission("workspace.invite"),
  workspaceController.inviteUser
);
router.put(
  "/decent-role/:id",
  permission("workspace.decent_role"),
  workspaceController.decentRoleUser
);
router.put("/change-workspace/:id", workspaceController.changeWorkspace);

router.put("/leave-workspace", workspaceController.leaveWorkspace);
router.put(
  "/cancel-user",
  permission("workspace.cancel"),
  workspaceController.cancelUser
);
router.put("/:id", permission("workspace.update"), workspaceController.update);
router.patch(
  "/:id",
  permission("workspace.update"),
  workspaceController.update
);
router.delete(
  "/:id",
  permission("workspace.delete"),
  workspaceController.delete
);

module.exports = router;
