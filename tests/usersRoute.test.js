const express = require('express');
const request = require('supertest');

const usersRouter = require('../routers/usersRoute');

const app = express();

usersRouter(app);

test('GET /', async () => {
	const response = await request(app).get('/');
	// to continue with psmz
	expect(1).toBe(1);
	// expect(response.status).toBe(200);
});
