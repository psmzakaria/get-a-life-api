/**** MOCK DATA ****/
const User = require("../models/user");
const Event = require("../models/event");

// Add event listener to log unhandledRejections
process.on("unhandledRejection", r => console.log(r));

const existingUser = {
  username: "john",
  password: "password"
};

const testEvents = [
  {
    title: "event2",
    startDate: "13/07/2018",
    endDate: "19/07/2018"
  },
  {
    startDate: "06082018",
    endDate: "07082018",
    matchedDates: ["06082018", "07082018"]
  },
  {
    startDate: "06082018",
    endDate: "07082018",
    matchedDates: ["06082018", "07082018"],
    selectedDate: "06082018"
  },
  {
    title: "put attendee",
    attendee: []

  }
];

const addMockUser = async () => {
  const user = new User({ username: existingUser.username });
  user.setPassword(existingUser.password);
  await user.save();
};

const addTestEvents = async () => {
  const user = await User.findOne({ username: existingUser.username });

  testEvents.forEach(async event => {
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
  existingUser,
  testEvents,
  addMockUser,
  addTestEvents,
  setUpMongoose,
  tearDownMongoose,
  dropDatabase
};
