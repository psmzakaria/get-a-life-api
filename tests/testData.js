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

module.exports = {
  TEST_EVENTS,
  TEST_USER
};
