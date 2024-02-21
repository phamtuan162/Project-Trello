var express = require("express");
var authController = require("../../../controllers/api/auth/auth.controller");
var router = express.Router();
// router.post("/login", authController.login);
// router.get("/profile", authController.profile);
// router.get("/google", passport.authenticate("google"));
// router.get("/google/callback", passport.authenticate("google"), (req, res) => {
//   const accessToken = generateAccessToken(req.user.id);
//   res.json({
//     status: 200,
//     message: "Success",
//     access_token: accessToken,
//     data: req.user,
//   });
// });

// router.get("/github", passport.authenticate("github"));
// router.get("/github/callback", passport.authenticate("github"), (req, res) => {
//   const accessToken = generateAccessToken(req.user.id);
//   res.json({
//     status: 200,
//     message: "Success",
//     access_token: accessToken,
//     data: req.user,
//   });
// });

module.exports = router;
