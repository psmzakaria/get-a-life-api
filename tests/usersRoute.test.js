const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

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
  await mongoose.connect(uri,{ useNewUrlParser: true });
});

afterAll(() => {
  mongoose.disconnect()
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

test('should return back a username when query matches ', async () => {
  const agent = request.agent(app);
  // signup user
  await agent.post('/users/signup').send(user01);

  // sign in user
  await agent.post('/users/signin').send(user01);

  const response = await agent.get('/users/findUser').query('username=user01');
  expect(response.status).toBe(200);
});

test('should return back a user not found when query does not match ', async () => {
  const agent = request.agent(app);
  // signup user
  await agent.post('/users/signup').send(user01);

  // sign in user
  await agent.post('/users/signin').send(user01);

  const response = await agent.get('/users/findUser').query('username=user02');
  expect(response.status).toBe(404);
  expect(response.body.message).toBe('user not found')
});
