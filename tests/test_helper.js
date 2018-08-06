require("dotenv").config();
const User = require("../models/user");
const Event = require("../models/event");
const eachDay = require("date-fns/each_day");
const getDate = require("../helpers/getDate");
const format = require("date-fns/format");

const saveNewUser = async user => {
  const { username } = user;
  const newUser = new User({
    username
  });
  newUser.setPassword(user.password);
  const savedUser = await newUser.save();
  //   const userId = {id: savedUser._id}
  //   const token = jwt.sign(userId, jwtOptions.secretOrKey)
  //   const userInfo = {username: savedUser._id, token: token}
  //   return userInfo
  return savedUser._id;
};

const getProposedDates = (sDate, eDate) => {
    const startDate = getDate(sDate)
    const endDate = getDate(eDate)
    const result = eachDay(startDate, endDate);
    return result.map(date => {
        return format(date, "YYYYMMDD");
      })
}

const saveNewEvent = async (event,hostId) => {
    const newEvent = new Event({
      title: event.title,
      proposedDates: getProposedDates(event.startDate, event.endDate),
      hostId: hostId,
      matchedDates: event.matchedDates,
      selectedDate: event.selectedDate
    });
    const savedEvent = await newEvent.save();
    return savedEvent._id
};

module.exports = {
  saveNewUser,
  saveNewEvent
};
