var express = require("express");
var router = express.Router();
const columnController = require("../../../controllers/api/workspace/column.controller");
const permission = require("../../../middlewares/api/permission.middleware");
const authMiddleware = require("../../../middlewares/api/auth.middleware");
router.get("/", columnController.index);
router.get("/:id", columnController.find);
router.put("/move-card", columnController.moveCardDiffBoard);
router.put(
  "/move-column/:id",

  columnController.moveColumnDiffBoard
);
router.post("/copy-column", authMiddleware, columnController.copyColumn);
router.post(
  "/",
  authMiddleware,
  permission("column.create"),
  columnController.store
);
router.put(
  "/:id",
  authMiddleware,
  permission("column.update"),
  columnController.update
);
router.patch(
  "/:id",
  authMiddleware,
  permission("column.update"),
  columnController.update
);
router.delete(
  "/:id",
  authMiddleware,
  permission("column.delete"),
  columnController.delete
);

module.exports = router;
