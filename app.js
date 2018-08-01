const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const indexRouter = require("./routers/index");
const usersRouter = require("./routers/usersRoute");
const eventsRouter = require("./routers/eventsRoute");

var corsOptions = {
  origin: [/http:\/\/localhost:.*/, /http[s]*:\/\/.*\.herokuapp.com/],
  credentials: true
};

if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: process.env.GAL_UI_URL, credentials: true }));
} else {
  app.use(cors(corsOptions));
}
app.use(cookieParser());
app.use(express.json());

indexRouter(app);
usersRouter(app);
eventsRouter(app);

module.exports = app;
