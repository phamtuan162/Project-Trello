var express = require("express");
var router = express.Router();
const workspaceController = require("../../../controllers/api/workspace/workspace.controller");

router.get("/", workspaceController.index);
router.get("/:id", workspaceController.find);
router.post("/", workspaceController.store);
router.post("/invite", workspaceController.inviteUser);
router.put("/:id", workspaceController.update);
router.patch("/:id", workspaceController.update);
router.delete("/:id", workspaceController.delete);

module.exports = router;
