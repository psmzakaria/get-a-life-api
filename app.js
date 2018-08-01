require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { passport } = require("./config/passport");

const app = express();
const indexRouter = require("./routers/index");
const usersRouter = require("./routers/usersRoute");
const eventsRouter = require("./routers/eventsRoute");

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

var corsOptions = {
  origin: [/http:\/\/localhost:.*/, /http[s]*:\/\/.*\.herokuapp.com/],
  credentials: true
};

if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: process.env.GAL_UI_URL, credentials: true }));
} else {
  app.use(cors(corsOptions));
}

indexRouter(app);
usersRouter(app);
eventsRouter(app);

module.exports = app;
