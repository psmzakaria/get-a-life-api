require("dotenv").config();
const request = require("supertest");
const express = require("express");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const { saveNewUser, saveNewEvent } = require("../test_helper");

const mockAuthenticateUser = jest.fn();
jest.doMock("../../middlewares/auth", () => {
  return {
    authenticateUser: mockAuthenticateUser
  };
});

const usersRoute = require("../../routers/usersRoute");
const app = express();
usersRoute(app);

const user01 = {
  username: "user01",
  password: "password01"
};

const event1 = {
  title: "event1",
  startDate: "13/07/2018",
  endDate: "15/07/2018"
};
const event2 = {
  title: "event2",
  startDate: "16/07/2018",
  endDate: "19/07/2018"
};
const event3 = {
  title: "event2",
  startDate: "13/07/2018",
  endDate: "19/07/2018"
};

beforeAll(async () => {
  jest.setTimeout(12000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

beforeEach(() => {
  mongoose.connection.db.dropDatabase();
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("GET users/:username should return correct event details ", async () => {
  const user1Id = await saveNewUser(user01);
  await saveNewEvent(event1, user1Id);
  await saveNewEvent(event2, user1Id);
  await saveNewEvent(event3, user1Id);
  mockAuthenticateUser.mockImplementation((req, res, next) => {
    next();
  });

  const agent = request.agent(app);
  const response = await agent.get("/users/user01");

  expect(response.status).toBe(200);
  expect(response.body.username).toBe("user01");
  expect(response.body.hostedEvents.length).toEqual(3);
  expect(response.body.hostedEvents[0].title).toEqual("event1");
  expect(response.body.hostedEvents[0].hostId.username).toEqual("user01");
});

test("GET users/:username -should provide correct status body ", async () => {
  const user1Id = await saveNewUser(user01);
  const event4 = {
    startDate: "06082018",
    endDate: "07082018",
    matchedDates: ["06082018", "07082018"]
  };
  const event5 = {
    startDate: "06082018",
    endDate: "07082018",
    matchedDates: ["06082018", "07082018"],
    selectedDate: "06082018"
  };
  await saveNewEvent(event3, user1Id);
  await saveNewEvent(event4, user1Id);
  await saveNewEvent(event5, user1Id);
  mockAuthenticateUser.mockImplementation((req, res, next) => {
    next();
  });

  const agent = request.agent(app);
  const response = await agent.get("/users/user01");

  expect(response.body.statuses[0]).toEqual("Pending for reply");
  expect(response.body.statuses[1]).toEqual("Pending for host reply");
  expect(response.body.statuses[2]).toEqual("06082018");
});
