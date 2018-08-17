const request = require("supertest");
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

describe("GET /users/all", () => {
  test("should return all username", async () => {
    const agent = request.agent(app);
    await agent.post("/account/signin").send(TEST_USER);
    const response = await agent.get("/users/all");

    expect(response.status).toBe(200);
    expect(response.body.allUsernames.length).toBe(1);
    expect(response.body.allUsernames[0].username).toBe(TEST_USER.username);
  });
});

describe("GET users/:username", () => {
  test("should provide correct status body", async () => {
    const agent = request.agent(app);
    await agent.post("/account/signin").send(TEST_USER);
    const response = await agent.get(`/users/${TEST_USER.username}`);

    expect(response.status).toBe(200);
    expect(Object.keys(response.body).length).toBe(8);
    expect(response.body).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        userId: expect.any(String),
        hostedEvents: expect.any(Array),
        hostedStatuses: expect.any(Array),
        invitedEvents: expect.any(Array),
        invitedStatuses: expect.any(Array),
        acceptedEvents: expect.any(Array),
        acceptedStatuses: expect.any(Array)
      })
    );
  });

  test("should return status 401 without auth/signin", async () => {
    const agent = request.agent(app);
    
    const response = await agent.get("/users/user01");
    expect(response.status).toBe(401);
  });

  test.only("should return status 401 if req user cookie is not the same as req.params.id", async () => {
    const agent = request.agent(app);
    await agent.post("/account/signup").send({username: "newUser", password: "00000"});
    await agent.post("/account/signin").send({username: "newUser", password: "00000"});

    const response = await agent.get(`/users/${TEST_USER.username}`);
    expect(response.status).toBe(401);
  });

  test("should provide invitedEvents with status pending and acceptedEvents with status accepted", async () => {
    const hostUser = { username: "host", password: "000000" };
    const guestUser = { username: "guest", password: "000000" };
    const hostId = await saveNewUser(hostUser);
    const guestId = await saveNewUser(guestUser);
    const eventWithGuest = {
      title: "get a life",
      startDate: "13/07/2018",
      endDate: "15/07/2018"
    };
    const pendingAttendee = [{ userId: guestId, status: "pending" }];
    const acceptedAttendee = [{ userId: guestId, status: "accepted" }];
    await saveNewEventWithGuest(eventWithGuest, hostId, pendingAttendee);
    await saveNewEventWithGuest(eventWithGuest, hostId, acceptedAttendee);

    const agent = request.agent(app);
    await agent.post("/account/signin").send(guestUser);
    const response = await agent.get("/users/guest");
    expect(response.status).toBe(200);
    expect(response.body.invitedEvents[0].attendees[0].status).toBe("pending");
    expect(response.body.invitedEvents.length).toBe(1);
    expect(response.body.acceptedEvents[0].attendees[0].status).toBe(
      "accepted"
    );
    expect(response.body.acceptedEvents.length).toBe(1);
  });
});
