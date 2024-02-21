var express = require("express");
var router = express.Router();
const columnController = require("../../../controllers/api/workspace/column.controller");

router.get("/", columnController.index);
router.get("/:id", columnController.find);
router.post("/", columnController.store);
router.put("/:id", columnController.update);
router.patch("/:id", columnController.update);
router.delete("/:id", columnController.delete);

module.exports = router;
