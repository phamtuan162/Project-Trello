var express = require("express");
var router = express.Router();
const cardController = require("../../../controllers/api/workspace/card.controller");

router.get("/", cardController.index);
router.get("/:id", cardController.find);
router.post("/", cardController.store);
router.put("/:id", cardController.update);
router.patch("/:id", cardController.update);
router.delete("/:id", cardController.delete);

module.exports = router;
