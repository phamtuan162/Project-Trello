require("dotenv").config();
const { User } = require("./models/index");
var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var path = require("path");
var logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const googlePassport = require("./passports/google.passport");
const githubPassport = require("./passports/github.passport");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api/index");

const whitelist = require("./utils/cors");
const cors = require("cors");
// var corsOptions = {
//   origin: function (origin, callback) {
//     const env = process.env.NODE_ENV || "development";
//     if (env === "production") {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//       return;
//     }

//     callback(null, true);
//   },
// };

var corsOptions = {
  origin: "*",
  methods: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
var app = express();
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

app.use("/api/v1", cors(corsOptions), apiRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);

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
