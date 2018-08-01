const request = require("supertest");
const Event = require("../models/event");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");
const app = require('../app')

const user01 = {
  username: "user01",
  password: "password01"
};

beforeAll(async () => {
  jest.setTimeout(30000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("POST /events/create should create new event by authorised user", async () => {
  const newEvent = {
    title: "get a life",
    startDate: "13/07/2018",
    endDate: "15/07/2018"
  };

  const agent = request.agent(app)
  
  // signup user
  await agent
  .post("/users/signup")
  .send(user01);

  // sign in user
  await agent
  .post("/users/signin")
  .send(user01)
  
  const response = await agent
    .post("/events/create")
    .send(newEvent);

  const events = await Event.find();
  
  expect(response.status).toBe(201);
  expect(events.length).toEqual(1);
  expect(events[0].proposedDates).toEqual(
    expect.arrayContaining(["20180713", "20180714", "20180715"])
  );
});

test("POST /events/create non-authorised user can't create new event", async () => {
  const newEvent = {
    title: "get a life",
    startDate: "13/07/2018",
    endDate: "15/07/2018"
  };

  const agent = request.agent(app)
  
  const response = await agent
    .post("/events/create")
    .send(newEvent);

  const events = await Event.find();
  
  expect(response.status).toBe(401);
});