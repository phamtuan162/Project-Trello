var express = require("express");
var router = express.Router();
const cardController = require("../../../controllers/api/workspace/card.controller");
const permission = require("../../../middlewares/api/permission.middleware");

router.get("/", cardController.index);
router.get("/:id", cardController.find);
router.post("/", permission("card.create"), cardController.store);
router.post(
  "/assign-user/:id",
  permission("card.assign_user"),
  cardController.assignUser
);
router.post("/copy-card", cardController.copyCard);
router.put(
  "/un-assign-user/:id",
  permission("card.un_assign_user"),
  cardController.unAssignUser
);
router.put(
  "/date-card/:id",
  permission("card.date_card"),
  cardController.update
);

router.put("/:id", permission("card.update"), cardController.update);
router.patch("/:id", permission("card.update"), cardController.update);
router.delete("/:id", permission("card.delete"), cardController.delete);

module.exports = router;
