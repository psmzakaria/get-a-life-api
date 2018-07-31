const express = require("express");
const Event = require("./../models/event");
const User = require("./../models/user");

const router = express.Router();

// router.get('/', (req, res) => {
// 	console.log(req.user);
// 	res.json({ message: 'Express is up!' });
// });

router.post("/create", async (req, res, next) => {
  res.status(201);
});

module.exports = app => {
  app.use(express.json());
  app.use("/events", router);
};
