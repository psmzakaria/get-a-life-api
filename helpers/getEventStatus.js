const getEventStatus = event => {
  if (event.selectedDate !== undefined) return event.selectedDate;
  //todo if time allows 
  //if (event.matchedDates.length !== 0) return "Pending for host reply";
  return "Pending for reply";
};

module.exports = getEventStatus;
