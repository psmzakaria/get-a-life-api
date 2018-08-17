require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { passport } = require("./config/passport");

const app = express();
const indexRouter = require("./routers/index");
const accountRouter = require("./routers/accountRoute");
const usersRouter = require("./routers/usersRoute");
const eventsRouter = require("./routers/eventsRoute");
const { errorHandler } = require("./middlewares/errorHandler");

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());

var corsOptions = {
  origin: [/http:\/\/localhost:.*/, /http[s]*:\/\/get-a-life.*\.herokuapp.com/],
  credentials: true
};  

app.use(cors(corsOptions));

indexRouter(app);
accountRouter(app);
usersRouter(app);
eventsRouter(app);

app.use(errorHandler);

module.exports = app;
