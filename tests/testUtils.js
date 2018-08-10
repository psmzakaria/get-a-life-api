require("dotenv").config();
const User = require("../models/user");
const Event = require("../models/event");
const eachDay = require("date-fns/each_day");
const getDate = require("../helpers/getDate");
const format = require("date-fns/format");
const { TEST_EVENTS, TEST_USER } = require("./testData");

const saveNewUser = async user => {
  const { username } = user;
  const newUser = new User({
    username
  });
  newUser.setPassword(user.password);
  const savedUser = await newUser.save();
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

const addTestUser = async () => {
  const user = new User({ username: TEST_USER.username });
  user.setPassword(TEST_USER.password);
  await user.save();
};

const addTestEvents = async () => {
  const user = await User.findOne({ username: TEST_USER.username });

  TEST_EVENTS.forEach(async event => {
    const newEvent = new Event({
      title: event.title,
      hostId: user._id,
      matchedDates: event.matchedDates,
      selectedDate: event.selectedDate
    });
    await newEvent.save();
  });
};

/***** MONGOOSE MEMORY SERVER *****/

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const setUpMongoose = async () => {
  jest.setTimeout(10000);
  const uri = await mongod.getConnectionString();
  await mongoose.connect(
    uri,
    { useNewUrlParser: true }
  );
};

const tearDownMongoose = async () => {
  mongoose.disconnect();
  mongod.stop();
};

const dropDatabase = async () => {
  await mongoose.connection.db.dropDatabase();
};

module.exports = {
  addTestUser,
  addTestEvents,
  setUpMongoose,
  tearDownMongoose,
  dropDatabase,
  saveNewUser,
  saveNewEvent,
  saveNewEventWithGuest
};
