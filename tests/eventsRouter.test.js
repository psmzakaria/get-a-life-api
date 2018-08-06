const request = require("supertest");
const Event = require("../models/event");
const User = require("../models/user");
const app = require("../app");
const {
  setUpMongoose,
  tearDownMongoose,
  addMockUser,
  existingUser
} = require("../utilities/testUtils");

beforeAll(async () => {
  await setUpMongoose();
  await addMockUser();
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

    const response = await agent.post("/events/create").send(newEvent);

    const events = await Event.find();
    const user = await User.findOne({ username: existingUser.username });

    expect(response.status).toBe(201);
    expect(events.length).toEqual(1);
    expect(events[0].proposedDates).toEqual(
      expect.arrayContaining(["20180713", "20180714", "20180715"])
    );
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
