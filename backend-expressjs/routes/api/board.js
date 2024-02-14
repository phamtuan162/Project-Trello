var express = require("express");
var router = express.Router();
const boardController = require("../../controllers/api/board.controller");

router.get("/", boardController.index);
router.get("/:id", boardController.find);
router.post("/", boardController.store);
router.put("/move-card/:id", boardController.moveCard);
// router.put("/board/:id", boardController.update);
// router.patch("/board/:id", boardController.update);
router.delete("/:id", boardController.delete);

module.exports = router;
