/**** MOCK DATA ****/
const User = require("../models/user");

const existingUser = {
  username: "john",
  password: "password"
};

const addMockUser = async () => {
  const user = new User({ username: existingUser.username });
  user.setPassword(existingUser.password);
  await user.save();
};

/***** MONGOOSE MEMORY SERVER *****/

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const setUpMongoose = async () => {
  jest.setTimeout(10000);
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
};

const tearDownMongoose = async () => {
  mongoose.disconnect();
  mongod.stop();
};

const dropDatabase = async () => {
  mongoose.connection.db.dropDatabase();
};

module.exports = {
  existingUser,
  addMockUser,
  setUpMongoose,
  tearDownMongoose,
  dropDatabase
};
