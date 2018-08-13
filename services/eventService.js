const eachDay = require("date-fns/each_day");
const format = require("date-fns/format");
const User = require("../models/user");
const Event = require("./../models/event");
const getDate = require("../helpers/getDate");

const createEvent = async (req, res, next) => {
  try {
    const startDate = getDate(req.body.startDate);
    const endDate = getDate(req.body.endDate);

    const result = eachDay(startDate, endDate);

    const newEvent = new Event({
      title: req.body.title,
      proposedDates: result.map(date => {
        return format(date, "YYYYMMDD");
      }),
      hostId: req.user._id,
      description: req.body.description,
      attendees: req.body.attendees
    });
    const event = await newEvent.save();

    req.event = event;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent
};
