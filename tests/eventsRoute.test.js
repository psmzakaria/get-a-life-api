const request = require("supertest");
const Event = require("../models/event");
const User = require("../models/user");
const app = require("../app");
const {
  setUpMongoose,
  tearDownMongoose,
  addTestUser,
  addTestEvents,
  saveNewUser,
  saveNewEventWithGuest
} = require("./testUtils");
const { TEST_USER } = require("./testData");

beforeAll(async () => {
  await setUpMongoose();
  await addTestUser();
  await addTestEvents();
});
afterAll(tearDownMongoose);

describe("POST /events/create", () => {
  test("should return status 201 if authorised user create event", async () => {
    const newEvent = {
      title: "get a life",
      startDate: "13/07/2018",
      endDate: "15/07/2018",
      attendees: []
    };

    const agent = request.agent(app);
    await agent.post("/account/signin").send(TEST_USER);

    const originalEventsLength = (await Event.find()).length;
    const response = await agent.post("/events/create").send(newEvent);

    const events = await Event.find();
    const user = await User.findOne({ username: TEST_USER.username });

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

  test("should save attendees properly", async () => {
    const user1 = { username: "user1", password: "000000" };
    const user2 = { username: "user2", password: "000000" };
    let user1Id = await saveNewUser(user1);
    let user2Id = await saveNewUser(user2);
    const newEvent = {
      title: "event 1",
      startDate: "13/07/2018",
      endDate: "15/07/2018",
      description: "new description",
      attendees: [{ _id: user1Id }, { _id: user2Id }]
    };
    const agent = request.agent(app);
    await agent.post("/account/signin").send(TEST_USER);
    const response = await agent.post("/events/create").send(newEvent);

    expect(response.status).toBe(201);
    expect(response.body.attendees.length).toBe(2);
    expect(response.body.attendees[0]._id).toContain(user1Id);
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

describe("GET /events/:id/dates", async () => {
  test("should return an object with two array, pending and attending.", async () => {
    const hostUser = { username: "host", password: "000000" };
    const guestUser = { username: "guest", password: "000000" };
    const guest02User = { username: "guest02", password: "000000" };
    const hostId = await saveNewUser(hostUser);
    const guestId = await saveNewUser(guestUser);
    const guest02Id = await saveNewUser(guest02User);
    const eventWithGuest = {
      title: "get a life",
      startDate: "13/07/2018",
      endDate: "15/07/2018"
    };
    const attendees = [
      { userId: guestId, status: "pending" },
      {
        userId: guest02Id,
        availableDates: ["20180713", "20180714"],
        status: "accepted"
      }
    ];
    const eventId = await saveNewEventWithGuest(
      eventWithGuest,
      hostId,
      attendees
    );

    const agent = request.agent(app);
    const response = await agent.get(`/events/${eventId}/dates`);

    expect(response.status).toBe(200);
    expect(Object.keys(response.body).length).toBe(2);
    expect(response.body).toEqual(
      expect.objectContaining({
        attending: expect.any(Array),
        pending: expect.any(Array)
      })
    );

    response.body.attending.forEach(day => {
      expect(day).toEqual(
        expect.objectContaining({
          date: expect.any(String),
          attendees: expect.any(Array)
        })
      );
    });

    response.body.pending.forEach(name => {
      expect(typeof name).toBe("string");
    });
  });
});

// describe.skip("PUT /events/:id/attendees should amend the attendee list", () => {
//   test('should', async () => {
//     const agent = request.agent(app);
//     const event = await Event.findOne({title: "put attendee"})
//     const id = event._id
//     const response = await agent.put(`/events/${id}/attendees`).send([TEST_USER.username])

//     expect(response.status).toBe(201)
//     const amendedEvent = await Event.findOne({title: "put attendee"})
//     expect(amendedEvent.attendees.length).toBe(1)
//     expect(amendedEvent.attendees[0].username).toBe(TEST_USER.username)
//   })

// })
