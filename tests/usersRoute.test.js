const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const { saveNewUser, saveNewEvent } = require("./test_helper");

const mockAuthenticateUser = jest.fn();
jest.doMock("../middlewares/auth", () => {
  return {
    authenticateUser: mockAuthenticateUser
  };
});

const app = require("../app");

const user01 = {
  username: "user01",
  password: "password01"
};

const userNoUsername = {
  password: "password"
};

beforeAll(async () => {
  jest.setTimeout(12000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(
    uri,
    { useNewUrlParser: true }
  );
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

describe("POST /signup", () => {
  test('post a unique new user should return response status 201"', async () => {
    const response = await request(app)
      .post("/users/signup")
      .send(user01);

    expect(response.status).toBe(201);
  });

  test("post a duplicate new user should return response status 500", async () => {
    const response = await request(app)
      .post("/users/signup")
      .send(user01);
    expect(response.status).toBe(500);
  });

  test("post a new user with no username should return response status 500", async () => {
    const response = await request(app)
      .post("/users/signup")
      .send(userNoUsername);
    expect(response.status).toBe(500);
  });
});

describe("POST /signin", () => {
  test("should return a status of 201 with valid username and password", async () => {
    const response = await request(app)
      .post("/users/signin")
      .send(user01);
    expect(response.status).toBe(201);
  });

  test("should return a status of 401 with an existing username but false password", async () => {
    const response = await request(app)
      .post("/users/signin")
      .send({
        username: user01.username,
        password: "wrong password"
      });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("passwords did not match");
  });
});

test("should return back a username when query matches ", async () => {
  mockAuthenticateUser.mockImplementationOnce(
    require.requireActual("../middlewares/auth.js").authenticateUser
  );
  const agent = request.agent(app);
  // signup user
  await agent.post("/users/signup").send(user01);

  // sign in user
  await agent.post("/users/signin").send(user01);

  const response = await agent.get("/users/findUser").query("username=user01");
  expect(response.status).toBe(200);
});

test("should return back a user not found when query does not match ", async () => {
  mockAuthenticateUser.mockImplementationOnce(
    require.requireActual("../middlewares/auth.js").authenticateUser
  );
  const agent = request.agent(app);
  // signup user
  await agent.post("/users/signup").send(user01);

  // sign in user
  await agent.post("/users/signin").send(user01);

  const response = await agent.get("/users/findUser").query("username=user02");
  expect(response.status).toBe(404);
  expect(response.body.message).toBe("user not found");
});

describe("GET users/:username works with auth/integrated", () => {
  test("GET users/:username with correct auth should return user details", async () => {
    mockAuthenticateUser.mockImplementationOnce(
      require.requireActual("../middlewares/auth.js").authenticateUser
    );
    const agent = request.agent(app);
    // signup user
    await agent.post("/users/signup").send(user01);

    // sign in user
    await agent.post("/users/signin").send(user01);

    const response = await agent.get("/users/user01");
    expect(response.status).toBe(200);
    expect(response.body.username).toBe("user01");
  });

  test("GET users/:username without auth/signin should return status 401", async () => {
    mockAuthenticateUser.mockImplementationOnce(
      require.requireActual("../middlewares/auth.js").authenticateUser
    );
    const agent = request.agent(app);

    const response = await agent.get("/users/user01");
    expect(response.status).toBe(401);
  });
});

describe("GET users/:username should work with mock authentication", () => {
  beforeEach(() => {
    mongoose.connection.db.dropDatabase();
  });
  test("should return correct event details", async () => {
    const user1Id = await saveNewUser(user01);
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
    await saveNewEvent(event1, user1Id);
    await saveNewEvent(event2, user1Id);
    mockAuthenticateUser.mockImplementation((req, res, next) => {
      next();
    });

    const agent = request.agent(app);
    const response = await agent.get("/users/user01");

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("user01");
    expect(response.body.hostedEvents.length).toEqual(2);
    expect(response.body.hostedEvents[0].title).toEqual("event1");
    expect(response.body.hostedEvents[0].hostId.username).toEqual("user01");
  });

  test("should provide correct status body", async () => {
    const user1Id = await saveNewUser(user01);
    const event3 = {
      title: "event2",
      startDate: "13/07/2018",
      endDate: "19/07/2018"
    };
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
});
