const request = require('supertest');
const app = require('../app');

const { setUpMongoose, tearDownMongoose, addMockUser, existingUser, addTestEvents } = require('../utilities/testUtils');

beforeAll(async () => {
	await setUpMongoose();
	await addMockUser();
	await addTestEvents();
});
afterAll(tearDownMongoose);

describe('GET /users/all', () => {
	test('should return all username', async () => {
		const agent = request.agent(app);
		await agent.post('/account/signin').send(existingUser);
		const response = await agent.get('/users/all');

		expect(response.status).toBe(200);
		expect(response.body.allUsernames.length).toBe(1);
		expect(response.body.allUsernames[0].username).toBe(existingUser.username);
	});
});

describe('GET /users/findUser', () => {
	test('should return back a username when query matches ', async () => {
		const agent = request.agent(app);
		await agent.post('/account/signin').send(existingUser);

		const response = await agent.post('/users/findUser').send({ username: existingUser.username });

		expect(response.status).toBe(200);
	});

	test('should return back a user not found when query does not match ', async () => {
		const agent = request.agent(app);
		await agent.post('/account/signin').send(existingUser);

		const response = await agent.post('/users/findUser').send({ username: 'notRegistered' });

		// expect(response.status).toBe(404);
		expect(response.body.message).toBe('user not found');
	});
});

describe('GET users/:username', () => {
	test('should provide correct status body', async () => {
		const agent = request.agent(app);
		await agent.post('/account/signin').send(existingUser);
		const response = await agent.get(`/users/${existingUser.username}`);

		expect(response.status).toBe(200);
		expect(Object.keys(response.body).length).toBe(3);
		expect(response.body).toEqual(
			expect.objectContaining({
				username: expect.any(String),
				hostedEvents: expect.any(Array),
				statuses: expect.any(Array)
			})
		);
	});

	test('should return status 401 without auth/signin', async () => {
		const agent = request.agent(app);

		const response = await agent.get('/users/user01');
		expect(response.status).toBe(401);
	});
});
