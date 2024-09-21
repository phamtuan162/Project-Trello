var express = require("express");
var router = express.Router();
const cardController = require("../../../controllers/api/workspace/card.controller");
const permission = require("../../../middlewares/api/permission.middleware");
const authMiddleware = require("../../../middlewares/api/auth.middleware");
const { multerMiddleware } = require("../../../utils/multer.utils");

router.get("/", cardController.index);
router.get("/:id", cardController.find);
router.post("/", permission("card.create"), cardController.store);
router.post(
  "/assign-user/:id",
  permission("card.assign_user"),
  cardController.assignUser
);
router.post("/copy-card", authMiddleware, cardController.copyCard);
router.post(
  "/uploads-file/:id",
  authMiddleware,
  multerMiddleware,
  cardController.uploads
);
router.put(
  "/un-assign-user/:id",
  permission("card.un_assign_user"),
  cardController.unAssignUser
);
router.put(
  "/date-card/:id",
  permission("card.date_card"),
  cardController.dateCard
);

router.put("/:id", permission("card.update"), cardController.update);
router.patch("/:id", permission("card.update"), cardController.update);
router.delete("/:id", permission("card.delete"), cardController.delete);

module.exports = router;
