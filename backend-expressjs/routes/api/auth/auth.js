var express = require("express");
const http = require("http");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/index");
const authController = require("../../../controllers/api/auth/auth.controller");
const authMiddleware = require("../../../middlewares/api/auth.middleware");
const passport = require("passport");

router.post("/check-email", authController.checkEmail);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.put(
  "/change-password/:id",

  authController.changePassword
);
router.get("/google/redirect", (req, res, next) => {
  const emptyResponse = new http.ServerResponse(req);

  passport.authenticate(
    "google",
    {
      scope: ["email", "profile"],
    },
    (err, user, info) => {
      console.log(err, user, info);
    }
  )(req, emptyResponse);

  const url = emptyResponse.getHeader("location");

  return res.status(200).json({
    status: 200,
    message: "Thành công",

    data: {
      urlRedirect: url,
    },
  });
});
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  async (req, res) => {
    // const user = await User.findOne({
    //   where: { email: req.user.emails[0].value },
    // });
    // const token = jwt.sign(
    //   {
    //     data: user.id,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: process.env.JWT_EXPIRES_IN,
    //   }
    // );
    return res.json({
      status: 200,
      message: "Success",
    });
  }
);
router.get("/github", passport.authenticate("github"));
router.get("/github/callback", passport.authenticate("github"));
router.get("/profile", authMiddleware, authController.profile);
router.post("/logout", authMiddleware, authController.logout);
router.post("/refresh", authController.refresh);
module.exports = router;
