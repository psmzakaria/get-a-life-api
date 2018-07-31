const express = require("express");
const Event = require("./../models/event");
const User = require("./../models/user");

const router = express.Router();

// router.get('/', (req, res) => {
// 	console.log(req.user);
// 	res.json({ message: 'Express is up!' });
// });

router.post("/create", async (req, res, next) => {
  try {
    const newEvent = new Event({
      title: req.body.title,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });
    await newEvent.save();
    res.status(201).json();
  } catch (error) {
    next(error);
  }
});

module.exports = app => {
  app.use(express.json());
  app.use("/events", router);
};
