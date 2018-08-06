const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const User = require("../models/user");
const app = require("../app");

beforeAll(async () => {
  jest.setTimeout(10000);

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

const existingUser = {
  username: "john",
  password: "password"
};

beforeEach(async () => {
  const user = new User({ username: existingUser.username });
  user.setPassword(existingUser.password);
  await user.save();
});

afterEach(async () => {
  await User.remove();
});

describe("POST /signup", () => {
  test("should return response status 201 and store in database if request body is valid", async () => {
    const response = await request(app)
      .post("/account/signup")
      .send({
        username: "testuser",
        password: "password"
      });

    const users = await User.find({ username: "testuser" });
    const cookies = response.headers["set-cookie"];

    expect(response.status).toBe(201);
    expect(users.length).toBe(1);
    expect(cookies).toBeDefined();
    expect(Object.keys(response.body).length).toBe(2);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        username: expect.any(String)
      })
    );
  });

  test("should return response status 400 if username already exists", async () => {
    const response = await request(app)
      .post("/account/signup")
      .send(existingUser);

    expect(response.status).toBe(400);
  });

  test("should return response status 400 if username format is invalid", async () => {
    const response = await request(app)
      .post("/account/signup")
      .send({ username: "!@#$%^", password: "password" });

    expect(response.status).toBe(400);
  });

  test("should return response status 400 if username is empty", async () => {
    const response = await request(app)
      .post("/account/signup")
      .send({ password: "password" });

    expect(response.status).toBe(400);
  });

  test("should return response status 400 if password is empty", async () => {
    const response = await request(app)
      .post("/account/signup")
      .send({ username: "testuser" });

    expect(response.status).toBe(400);
  });
});

describe("POST /signin", () => {
  test("should return a status of 201 with valid username and password", async () => {
    const response = await request(app)
      .post("/account/signin")
      .send(existingUser);

    expect(response.status).toBe(200);
  });

  test("should return a status of 401 with an existing username but false password", async () => {
    const response = await request(app)
      .post("/account/signin")
      .send({
        username: existingUser.username,
        password: "wrong password"
      });

    expect(response.status).toBe(401);
  });
});
