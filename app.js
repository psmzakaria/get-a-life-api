const express = require("express");
const app = express();

const indexRouter = require("./routers/index");

app.use(express.json());
indexRouter(app);

module.exports = app;
