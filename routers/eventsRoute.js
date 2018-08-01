const express = require("express");
const eachDay = require("date-fns/each_day");
const format = require("date-fns/format");
const Event = require("./../models/event");
const User = require("./../models/user");
const getDate = require("../helpers/getDate");

const router = express.Router();

// router.get('/', (req, res) => {
// 	console.log(req.user);
// 	res.json({ message: 'Express is up!' });
// });

router.post("/create", async (req, res, next) => {
  try {
    const startDate = getDate(req.body.startDate);
    const endDate = getDate(req.body.endDate);

    const result = eachDay(startDate, endDate);

    const newEvent = new Event({
      title: req.body.title,
      proposedDates: result.map(date => {
        return format(date, "YYYYMMDD");
      })
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
