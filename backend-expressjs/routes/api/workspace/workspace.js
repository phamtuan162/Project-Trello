var express = require("express");
var router = express.Router();
const workspaceController = require("../../../controllers/api/workspace/workspace.controller");

router.get("/", workspaceController.index);
router.get("/:id", workspaceController.find);
router.post("/", workspaceController.store);
// router.put("/workspace/:id", workspaceController.update);
// router.patch("/workspace/:id", workspaceController.update);
router.delete("/:id", workspaceController.delete);

module.exports = router;
