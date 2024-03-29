var express = require("express");
var router = express.Router();
const cardController = require("../../../controllers/api/workspace/card.controller");
const permission = require("../../../middlewares/api/permission.middleware");

router.get("/", cardController.index);
router.get("/:id", cardController.find);
router.post("/", permission("card.create"), cardController.store);
router.put("/:id", permission("card.update"), cardController.update);
router.patch("/:id", permission("card.update"), cardController.update);
router.delete("/:id", permission("card.delete"), cardController.delete);

module.exports = router;
