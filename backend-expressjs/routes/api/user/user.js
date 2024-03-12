var express = require("express");
var router = express.Router();
const userController = require("../../../controllers/api/user/user.controller");
const authMiddleware = require("../../../middlewares/api/auth.middleware");

router.get("/", userController.index);
router.get("/:id", userController.find);
router.post("/", userController.store);
router.put("/:id", userController.update);
router.patch("/:id", userController.update);
router.post("/delete", userController.delete);
module.exports = router;
