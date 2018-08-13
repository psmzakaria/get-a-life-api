const getDate = date => {
  const [day, month, year] = date.split("/");

  return new Date(`${year}/${month}/${day}`);
};

const formatDates = dates => {
  return dates.map(date => {
    return format(date, "YYYYMMDD");
  });
};
module.exports = { getDate, formatDates };
