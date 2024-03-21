require("dotenv").config();
const { User } = require("./models/index");
var createError = require("http-errors");
var express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend's origin
  credentials: true, // Allow cookies and authentication headers
  optionSuccessStatus: 200, // Return 200 for preflight requests
};

// var corsOptions = {
//   origin: "*",
//   methods: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//   allowedHeaders: "Content-Type,Authorization",
// };
var app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("a user connection");
});

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
