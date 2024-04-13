var express = require("express");
var router = express.Router();
const missionController = require("../../../controllers/api/mission/mission.controller");
const permission = require("../../../middlewares/api/permission.middleware");

router.get("/", missionController.index);
router.get("/:id", missionController.find);
router.post("/", permission("mission.create"), missionController.store);
router.put("/:id", permission("mission.update"), missionController.update);
router.patch("/:id", permission("mission.update"), missionController.update);
router.delete("/:id", permission("mission.delete"), missionController.delete);
module.exports = router;
