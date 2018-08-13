const eachDay = require("date-fns/each_day");
const format = require("date-fns/format");
const Event = require("./../models/event");
const { getDate } = require("../helpers/dateUtils");

const formatDates = dates =>
  dates.map(date => {
    return format(date, "YYYYMMDD");
  });

const createEvent = async (req, res, next) => {
  const startDate = getDate(req.body.startDate);
  const endDate = getDate(req.body.endDate);

  const rangeOfDates = eachDay(startDate, endDate);

  const event = await Event.create({
    title: req.body.title,
    proposedDates: formatDates(rangeOfDates),
    hostId: req.user._id,
    description: req.body.description,
    attendees: req.body.attendees
  });

  req.event = event.toObject();
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

const updateAttendeeAvailabilityInEvent = async (req, res, next) => {
  const eventId = req.params.id;
  const { status, availableDates } = req.body;
  const username = req.cookies["username"];
  const userId = req.cookies["userId"];
  console.log(
    "username and userId and status and availableDates",
    username,
    userId,
    status,
    availableDates
  );

  const event = await Event.findById(eventId);

  event.attendees.forEach(async attendee => {
    if (attendee.userId.toString() === userId) {
      attendee.availableDates = availableDates;
      attendee.status = status;
      await event.save();
    }
  });
  next();
};

module.exports = {
  createEvent,
  getEventByIdWithHostName,
  updateAttendeeAvailabilityInEvent
};
