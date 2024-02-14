var express = require("express");
var router = express.Router();
const workspaceRouter = require("./workspace");
const boardRouter = require("./board");
const columnRouter = require("./column");
const cardRouter = require("./card");

router.use("/workspace", workspaceRouter);

router.use("/board", boardRouter);

router.use("/column", columnRouter);

router.use("/card", cardRouter);

module.exports = router;
