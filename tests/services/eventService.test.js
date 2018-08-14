const mockingoose = require("mockingoose").default;
const {
  TEST_PROPOSED_DATES,
  STUB_EVENT,
  TEST_ATTENDANCE,
  STUB_EVENT_ATTENDEES
} = require("../testData");

const mockEachDay = jest.fn(() => TEST_PROPOSED_DATES);
const mockGetDate = jest.fn();
const mockFormatDates = jest.fn();
const mockFormatAttendeesData = jest.fn(() => TEST_ATTENDANCE);

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

  jest.doMock("../../helpers/dataFormatUtils.js", () => {
    return { formatAttendeesData: mockFormatAttendeesData };
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

describe("getAttendance working", () => {
  test("getAttendance should return an array of all proposed dates as objects with an attendees who can make it", async () => {
    mockingoose.Event.toReturn(STUB_EVENT_ATTENDEES, "findOne");
    const { getAttendance } = require("../../services/eventService");
    const req = {
      params: { id: "" },
      body: {},
      user: {
        _id: ""
      }
    };
    const next = () => {};

    // act
    await getAttendance(req, {}, next);

    // assert
    expect(mockFormatAttendeesData).toHaveBeenCalledTimes(1);
    expect(req.attendance).toEqual(TEST_ATTENDANCE);
  });
});
