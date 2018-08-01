const express = require("express");
const request = require("supertest");

const usersRouter = require("../routers/usersRoute");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();
const mongoose = require("mongoose");

const app = require("../app");
// usersRouter(app);

const user01 = {
  username: "user01",
  password: "password01"
};

const userNoUsername = {
  password: "password"
};

beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
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

test("GET/:username should return back with a status of ", async () => {
  const agent = request.agent(app);
  //signup user
  await agent.post("/users/signup").send(user01);

  // sign in user
  const responseSignin = await agent.post("/users/signin").send(user01);

  const response = await agent.get("/users/user01");

  expect(response.status).toBe(200);
});
