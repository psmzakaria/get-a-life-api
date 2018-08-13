const { getDate } = require("../../helpers/dateUtils");

test("should return date object", () => {
  const year = "2018";
  const month = "07";
  const day = "01";

  const dateInput = `${day}/${month}/${year}`;

  expect(getDate(dateInput)).toEqual(new Date(`${year}/${month}/${day}`));
});
