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

const STUB_EVENT_ATTENDEES = {
  proposedDates: ["20180813", "20180814", "20180815"],
  matchedDates: [],
  _id: "5b70ec9c7f0efa295602f5b8",
  title: "test event",
  hostId: "5b69323882ef8f6188d54051",
  attendees: [
    {
      availableDates: ["20180813", "20180814"],
      _id: "5b70ec9c7f0efa295602f5b9",
      userId: {
        username: "guest"
      },
      status: "accepted"
    },
    {
      availableDates: [],
      _id: "5b70ec9c7f0efa295602f5ba",
      userId: {
        username: "guest02"
      },
      status: "pending"
    }
  ],
  __v: 1
};

const TEST_ATTENDANCE = {
  attending: [
    {
      date: "20180813",
      attendees: ["guest"]
    },
    {
      date: "20180814",
      attendees: ["guest"]
    },
    {
      date: "20180815",
      attendees: []
    }
  ],
  pending: ["guest02"]
};

module.exports = {
  TEST_EVENTS,
  TEST_USER,
  TEST_PROPOSED_DATES,
  STUB_EVENT,
  STUB_EVENT_ATTENDEES,
  TEST_ATTENDANCE
};
