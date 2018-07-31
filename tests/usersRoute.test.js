const express = require('express');
const User = require('../models/user');
const request = require('supertest');

const usersRouter = require('../routers/usersRoute');

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');

const app = express();
usersRouter(app);

const user01 = {
	username: 'user01',
	password: 'password01'
};

// before all test blocks
beforeAll(async () => {
	jest.setTimeout(120000);

	const uri = await mongod.getConnectionString();
	await mongoose.connect(uri);
});

afterAll(() => {
	mongoose.disconnect();
	mongod.stop();
});

test('GET /users should return response 200', async () => {
	const response = await request(app).get('/users');
	expect(response.status).toBe(200);
});

test('POST /signup post a unique new user should return response status 200"', async () => {
	const response = await request(app).post('/users/signup').send(user01);

	expect(response.status).toBe(201);
});
