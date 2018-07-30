const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/", (req, res, next) => {
  res.json({ message: "Welcome to Get-A-Life, setup some activity!" });
});

module.exports = app => {
  app.use("/", router);
};
