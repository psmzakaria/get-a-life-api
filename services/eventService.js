const eachDay = require("date-fns/each_day");
const format = require("date-fns/format");
const User = require("../models/user");
const Event = require("./../models/event");
const getDate = require("../helpers/getDate");

const createEvent = async (req, res, next) => {
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
};

const getEventByIdWithHostName = async (req, res, next) => {
  const eventId = req.params.id;

  const event = await Event.findById(eventId).populate("hostId");
  if (event === null) {
    payload = null;
  } else {
    payload = {
      ...event._doc,
      hostName: event.hostId.username,
      hostId: event.hostId._id
    };
  }
  req.payload = payload;
  next();
};

module.exports = {
  createEvent,
  getEventByIdWithHostName
};
