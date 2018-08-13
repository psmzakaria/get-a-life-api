const mockingoose = require("mockingoose").default;
const { TEST_PROPOSED_DATES, STUB_EVENT } = require("../testData");

const mockEachDay = jest.fn(() => TEST_PROPOSED_DATES);
const mockGetDate = jest.fn();
const mockFormatDates = jest.fn();

beforeEach(() => {
  jest.doMock("date-fns/each_day", () => {
    return mockEachDay;
  });

  jest.doMock("date-fns/format", () => {
    return () => "1";
  });

  jest.doMock("../../helpers/dateUtils.js", () => {
    return { getDate: mockGetDate, formatDates: mockFormatDates };
  });
});

test("createEvent should create new event and add event to req object", async () => {
  // arrange
  mockingoose.Event.toReturn(STUB_EVENT, "save");
  const { createEvent } = require("../../services/eventService");
  const req = {
    body: {},
    user: {
      _id: ""
    }
  };
  const next = () => {};

  // act
  await createEvent(req, {}, next);

  // assert
  expect(mockEachDay).toHaveBeenCalledTimes(1);
  expect(mockGetDate).toHaveBeenCalledTimes(2);

  expect(req.event.title).toEqual(STUB_EVENT.title);
  expect(req.event.matchedDates).toEqual(STUB_EVENT.matchedDates);
  expect(req.event.attendees).toEqual(STUB_EVENT.attendees);
});
