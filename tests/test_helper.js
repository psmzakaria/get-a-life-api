require("dotenv").config();
const User = require("../models/user");
const Event = require("../models/event");
const eachDay = require("date-fns/each_day");
const getDate = require("../helpers/getDate");
const format = require("date-fns/format");

// Add event listener to log unhandledRejections
process.on("unhandledRejection", r => console.log(r));

const saveNewUser = async user => {
  const { username } = user;
  const newUser = new User({
    username
  });
  newUser.setPassword(user.password);
  const savedUser = await newUser.save();
  //   const userId = {id: savedUser._id}
  //   const token = jwt.sign(userId, jwtOptions.secretOrKey)
  //   const userInfo = {username: savedUser._id, token: token}
  //   return userInfo
  return savedUser._id;
};

const getProposedDates = (sDate, eDate) => {
  const startDate = getDate(sDate);
  const endDate = getDate(eDate);
  const result = eachDay(startDate, endDate);
  return result.map(date => {
    return format(date, "YYYYMMDD");
  });
};

const saveNewEvent = async (event, hostId) => {
  const newEvent = new Event({
    title: event.title,
    proposedDates: getProposedDates(event.startDate, event.endDate),
    hostId: hostId,
    matchedDates: event.matchedDates,
    selectedDate: event.selectedDate
  });
  const savedEvent = await newEvent.save();
  return savedEvent._id;
};

const saveNewEventWithGuest = async (event, hostId, attendees) => {
  const newEvent = new Event({
    title: event.title,
    proposedDates: getProposedDates(event.startDate, event.endDate),
    hostId: hostId,
    matchedDates: event.matchedDates,
    selectedDate: event.selectedDate,
    attendees: attendees
  });
  const savedEvent = await newEvent.save();
  return savedEvent._id;
};

const loginAs = async (app, user) => {
  let response = await request(app)
    .post("/account/signin")
    .send(user);

  expect(response.statusCode).toBe(200);
  return response.body.user;
}

module.exports = {
  saveNewUser,
  saveNewEvent,
  saveNewEventWithGuest,
  loginAs
};
