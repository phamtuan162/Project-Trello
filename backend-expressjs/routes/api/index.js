var express = require("express");
var router = express.Router();
const authRouter = require("./auth/auth");
const userRouter = require("./user/user");
const workspaceRouter = require("./workspace/workspace");
const boardRouter = require("./workspace/board");
const columnRouter = require("./workspace/column");
const cardRouter = require("./workspace/card");
const deviceRouter = require("./device/device");
router.use("/auth", authRouter);

router.use("/user", userRouter);

router.use("/workspace", workspaceRouter);

router.use("/board", boardRouter);

router.use("/column", columnRouter);

router.use("/card", cardRouter);

router.use("/device", deviceRouter);

module.exports = router;
