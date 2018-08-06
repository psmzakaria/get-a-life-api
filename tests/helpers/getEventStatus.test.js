const Event = require("../../models/event");
const getEventStatus = require("../../helpers/getEventStatus");

test("should return pending for guest to reply status", () => {
  const event = new Event({});

  expect(getEventStatus(event)).toEqual("Pending for reply");
});

test("should return pending for host to reply status", () => {
    const event = new Event({
        matchedDates: ['10/08/2018', '17/08/2018']
    });
  
    expect(getEventStatus(event)).toEqual("Pending for host reply");
  });

  test("should return the finalized event date if there is a selectedDate", () => {
    const event = new Event({
        matchedDates: ['10/08/2018', '17/08/2018'],
        selectedDate: '10/08/2018'
    });
  
    expect(getEventStatus(event)).toEqual("10/08/2018");
  });

