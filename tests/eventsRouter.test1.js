const express = require("express");
const request = require("supertest");

const eventsRoute = require("../routers/eventsRoute");
const Event = require("../models/event");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = express();

eventsRoute(app);

beforeAll(async () => {
  jest.setTimeout(30000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

test("POST /events/create should create new event", async () => {
  const newEvent = {
    title: "get a life",
    startDate: "13/07/2018",
    endDate: "15/07/2018"
  };

  const response = await request(app)
    .post("/events/create")
    .send(newEvent);

  const events = await Event.find();

  expect(response.status).toBe(201);
  expect(events.length).toEqual(1);
  expect(events[0].proposedDates).toEqual(
    expect.arrayContaining(["20180713", "20180714", "20180715"])
  );
});
