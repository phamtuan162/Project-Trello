var express = require("express");
var router = express.Router();
const authController = require("../../../controllers/api/auth/auth.controller");
const authMiddleware = require("../../../middlewares/api/auth.middleware");
const passport = require("passport");

router.post("/login", authController.login);
router.get("/google", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureFlash: true,
    successRedirect: "/",
  })
);
router.get("/github", passport.authenticate("github"));
router.get("/github/callback", passport.authenticate("github"));
router.get("/profile", authMiddleware, authController.profile);
router.post("/logout", authMiddleware, authController.logout);
router.post("/refresh", authController.refresh);
module.exports = router;
