var express = require("express");
var router = express.Router();
const authRouter = require("./auth/auth");
const userRouter = require("./user/user");
const workspaceRouter = require("./workspace/workspace");
const boardRouter = require("./workspace/board");
const columnRouter = require("./workspace/column");
const cardRouter = require("./workspace/card");
const deviceRouter = require("./device/device");
const roleRouter = require("./auth/role");
const permissionRouter = require("./auth/permission");
const workRouter = require("./work/work");
const missionRouter = require("./mission/mission");
const activityRouter = require("./activity/activity");

router.use("/auth", authRouter);

router.use("/role", roleRouter);

router.use("/permission", permissionRouter);

router.use("/user", userRouter);

router.use("/workspace", workspaceRouter);

router.use("/board", boardRouter);

router.use("/column", columnRouter);

router.use("/card", cardRouter);

router.use("/work", workRouter);

router.use("/mission", missionRouter);

router.use("/device", deviceRouter);

router.use("/activity", activityRouter);

module.exports = router;
