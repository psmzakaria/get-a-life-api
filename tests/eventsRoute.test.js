const request = require("supertest");
const Event = require("../models/event");
const User = require("../models/user");
const app = require("../app");
const {
  setUpMongoose,
  tearDownMongoose,
  addMockUser,
  addTestEvents,
  existingUser
} = require("../utilities/testUtils");

beforeAll(async () => {
  await setUpMongoose();
  await addMockUser();
  await addTestEvents();
});
afterAll(tearDownMongoose);

describe("POST /events/create", () => {
  test("should return status 201 if authorised user create event", async () => {
    const newEvent = {
      title: "get a life",
      startDate: "13/07/2018",
      endDate: "15/07/2018"
    };

    const agent = request.agent(app);
    await agent.post("/account/signin").send(existingUser);

    const originalEventsLength = (await Event.find()).length;
    const response = await agent.post("/events/create").send(newEvent);

    const events = await Event.find();
    const user = await User.findOne({ username: existingUser.username });

    expect(response.status).toBe(201);
    expect(events.length).toEqual(originalEventsLength + 1);
    expect(Array.isArray(events[0].proposedDates)).toBe(true);
    expect(events[0].hostId).toEqual(user._id);
  });

  test("should return status 401 when non-authorised user create new event", async () => {
    const newEvent = {
      title: "get a life",
      startDate: "13/07/2018",
      endDate: "15/07/2018"
    };

    const agent = request.agent(app);
    const response = await agent.post("/events/create").send(newEvent);

    expect(response.status).toBe(401);
  });
});

describe("GET /events/:id", () => {
  test("should return 400 and an error message when event Id is invalid", async () => {
    const agent = request.agent(app);
    const id = "invalid-id";
    const response = await agent.get(`/events/${id}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  test("should return null if the event doesnt exist", async () => {
    const agent = request.agent(app);
    const id = "1234567890841f4aa49137da";
    const response = await agent.get(`/events/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ payload: null });
  });

  test("should return event details if event exists", async () => {
    const agent = request.agent(app);
    const event = await Event.findOne({ title: "event2" });

    const id = event._id;
    const response = await agent.get(`/events/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.payload).toBeTruthy();
  });
});
