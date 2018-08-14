const { formatAttendeesData } = require("../../helpers/dataFormatUtils");
const { STUB_EVENT_ATTENDEES, TEST_ATTENDANCE } = require("../testData");

test("formatAttendeesData should return an object of attending users array and pending users array", () => {
  expect(formatAttendeesData(STUB_EVENT_ATTENDEES)).toEqual(TEST_ATTENDANCE);
});
