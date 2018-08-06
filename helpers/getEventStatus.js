const getEventStatus = event => {
  if (event.selectedDate !== undefined) return event.selectedDate;
  if (event.matchedDates.length !== 0) return "Pending for host reply";
  return "Pending for reply";
};

module.exports = getEventStatus;
