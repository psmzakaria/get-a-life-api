const formatAttendeesData = event => {
  const attendance = [];
  const pendingUsers = []

  event.proposedDates.forEach(date => {
    const attendeesArr = [];
    event.attendees.forEach(attendee => {
      if (
        attendee.status === "accepted" &&
        attendee.availableDates.indexOf(date) !== -1
      ) {
        attendeesArr.push(attendee.userId.username);
      } else if (attendee.status === "pending" && pendingUsers.indexOf(attendee.userId.username) === -1) {
        pendingUsers.push(attendee.userId.username)
      }
    });

    attendance.push({
      date: date,
      attendees: attendeesArr
    });
  });

  return {attending: attendance, pending: pendingUsers};
};

module.exports = { formatAttendeesData };
