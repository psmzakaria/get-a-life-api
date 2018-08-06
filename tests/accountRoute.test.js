const request = require("supertest");
const User = require("../models/user");
const app = require("../app");
const {
  existingUser,
  addMockUser,
  setUpMongoose,
  tearDownMongoose,
  dropDatabase
} = require("../utilities/testUtils");

beforeAll(setUpMongoose);
afterAll(tearDownMongoose);

beforeEach(addMockUser);
afterEach(dropDatabase);

describe("POST /signup", () => {
  test("should return response status 201 and store in database if request body is valid", async () => {
    const response = await request(app)
      .post("/account/signup")
      .send({
        username: "testuser",
        password: "password"
      });

    const users = await User.find({ username: "testuser" });

    expect(response.status).toBe(201);
    expect(users.length).toBe(1);
    expect(response.headers["set-cookie"]).toBeDefined();
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
    expect(response.headers["set-cookie"]).toBeDefined();
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
