const httpMocks = require("node-mocks-http");
const {
  respondWithCreatedEvent
} = require("../../controllers/eventsController");

test("respondWithCreatedEvent should return 201 with event object", () => {
  const DUMMY_EVENT = "dummy event";
  const req = { event: DUMMY_EVENT };
  const res = httpMocks.createResponse();

  respondWithCreatedEvent(req, res);

  expect(res._getStatusCode()).toBe(201);
  expect(JSON.parse(res._getData())).toBe(DUMMY_EVENT);
});
