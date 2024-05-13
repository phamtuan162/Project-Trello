var express = require("express");
var router = express.Router();
const commentController = require("../../../controllers/api/comment/comment.controller");
const authMiddleware = require("../../../middlewares/api/auth.middleware");

router.get("/", commentController.index);
router.get("/:id", commentController.find);
router.post("/", commentController.store);
router.put("/:id", commentController.update);
router.patch("/:id", commentController.update);
router.delete("/:id", commentController.delete);
module.exports = router;
