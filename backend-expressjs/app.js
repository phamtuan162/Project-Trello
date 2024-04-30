require("dotenv").config();
const { User } = require("./models/index");
const cron = require("node-cron");
const blacklist_token = require("./cronjobs/blacklist_tokens");
const card = require("./cronjobs/card");
const mission = require("./cronjobs/mission");

var createError = require("http-errors");
var express = require("express");

var cookieParser = require("cookie-parser");
var path = require("path");
var logger = require("morgan");
var compression = require("compression");
var helmet = require("helmet");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const googlePassport = require("./passports/google.passport");
const githubPassport = require("./passports/github.passport");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api/index");

const whitelist = require("./utils/cors");

//Cors
const cors = require("cors");
const { config } = require("dotenv");
const corsOptions = {
  origin: "*", // Replace with your frontend's origin
  credentials: true, // Allow cookies and authentication headers
  optionSuccessStatus: 200, // Return 200 for preflight requests
};

var app = express();

// app.set("port", 3001);

// /**
//  * Create HTTP server.
//  */

// var server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Hoặc bạn có thể cung cấp URL cụ thể của máy chủ web của bạn
//   },
// });
// // Sự kiện kết nối mới
// let onlineUsers = [];

// const addNewUser = (userId, socketId) => {
//   !onlineUsers.some((user) => +user.id === +userId) &&
//     onlineUsers.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUsers.find((user) => +user.id === +userId);
// };
// /**
//  * Listen on provided port, on all network interfaces.
//  */
// io.on("connection", (socket) => {
//   console.log("A user connected...");

//   // socket.on("newUser", (userId) => {
//   //   addNewUser(userId, socket.id);
//   //   const receiver = getUser(userId);
//   //   io.to(receiver.socketId).emit("getUsers", {
//   //     userId,
//   //   });
//   // });
//   // socket.on("sendNotification", ({ senderName, receiverName, type }) => {
//   //   const receiver = getUser(receiverName);
//   //   io.to(receiver.socketId).emit("getNotification", {
//   //     senderName,
//   //     type,
//   //   });
//   // });

//   // socket.on("sendText", ({ senderName, receiverName, text }) => {
//   //   const receiver = getUser(receiverName);
//   //   io.to(receiver.socketId).emit("getText", {
//   //     senderName,
//   //     text,
//   //   });
//   // });
//   // Xử lý sự kiện disconnect
//   // socket.on("disconnect", () => {
//   //   removeUser(socket.id);
//   // });
// });
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", true);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});

app.use(
  session({
    secret: "Pham Tuan",
    resave: false,
    saveUninitialized: true,
  })
);

// Cấu hình passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

passport.use("google", googlePassport);

passport.use("github", githubPassport);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", apiRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);

cron.schedule("* 0 * * *", () => {
  blacklist_token.delete();
});
cron.schedule("0 * * * *", () => {
  card.HandleExpired();
});
cron.schedule("0 * * * *", () => {
  mission.HandleExpired();
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
