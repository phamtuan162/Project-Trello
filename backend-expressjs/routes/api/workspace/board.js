var express = require("express");
var router = express.Router();
const boardController = require("../../../controllers/api/workspace/board.controller");
const permission = require("../../../middlewares/api/permission.middleware");
const authMiddleware = require("../../../middlewares/api/auth.middleware");
const checkBoardInWorkspace = require("../../../middlewares/api/board.middleware");
router.get("/", boardController.index);
router.get("/:id", authMiddleware, checkBoardInWorkspace, boardController.find);
router.post("/", permission("board.create"), boardController.store);
router.put("/move-card", authMiddleware, boardController.moveCard);

router.put("/:id", permission("board.update"), boardController.update);
router.patch("/:id", permission("board.update"), boardController.update);
router.delete("/:id", permission("board.delete"), boardController.delete);

module.exports = router;
