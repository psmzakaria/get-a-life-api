const TEST_EVENTS = [
  {
    title: "event2",
    startDate: "13/07/2018",
    endDate: "19/07/2018"
  },
  {
    startDate: "06082018",
    endDate: "07082018",
    matchedDates: ["06082018", "07082018"]
  },
  {
    startDate: "06082018",
    endDate: "07082018",
    matchedDates: ["06082018", "07082018"],
    selectedDate: "06082018"
  },
  {
    title: "put attendee",
    attendee: []
  }
];

const TEST_USER = {
  username: "john",
  password: "password"
};

const TEST_PROPOSED_DATES = [new Date("01/01/2018"), new Date("01/02/2018")];
const STUB_EVENT = {
  title: "some mock event",
  proposedDates: TEST_PROPOSED_DATES,
  attendees: [],
  matchedDates: []
};

module.exports = {
  TEST_EVENTS,
  TEST_USER,
  TEST_PROPOSED_DATES,
  STUB_EVENT
};
