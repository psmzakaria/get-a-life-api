const express = require("express");
const eachDay = require("date-fns/each_day");
const format = require("date-fns/format");
const Event = require("./../models/event");
const User = require("./../models/user");

const router = express.Router();

// router.get('/', (req, res) => {
// 	console.log(req.user);
// 	res.json({ message: 'Express is up!' });
// });

router.post("/create", async (req, res, next) => {
  try {
    const startDateArr = req.body.startDate.split("/");

    const startDate = new Date(
      startDateArr[2],
      startDateArr[1] - 1,
      startDateArr[0]
    );

    const endDateArr = req.body.endDate.split("/");

    const endDate = new Date(endDateArr[2], endDateArr[1] - 1, endDateArr[0]);

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
