var express = require("express");
var router = express.Router();
const columnController = require("../../../controllers/api/workspace/column.controller");
const permission = require("../../../middlewares/api/permission.middleware");

router.get("/", columnController.index);
router.get("/:id", columnController.find);
router.post("/", permission("column.create"), columnController.store);
router.put("/:id", permission("column.update"), columnController.update);
router.patch("/:id", permission("column.update"), columnController.update);
router.delete("/:id", permission("column.delete"), columnController.delete);

module.exports = router;
