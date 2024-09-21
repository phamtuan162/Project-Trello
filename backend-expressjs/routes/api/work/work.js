var express = require("express");
var router = express.Router();
const workController = require("../../../controllers/api/work/work.controller");
const permission = require("../../../middlewares/api/permission.middleware");

router.get("/", workController.index);
router.get("/:id", workController.find);
router.post("/", permission("work.create"), workController.store);
router.put("/:id", permission("work.update"), workController.update);
router.patch("/:id", permission("work.update"), workController.update);
router.delete("/:id", permission("work.delete"), workController.delete);
module.exports = router;
