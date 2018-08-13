const express = require("express");
const User = require("./../models/user");
const Event = require("./../models/event");
const { authenticateUser } = require("../middlewares/auth");
const getEventStatus = require("../helpers/getEventStatus");
const router = express.Router();

router.get("/all", authenticateUser, async (req, res, next) => {
  try {
    const allUsernames = await User.find().select("username -_id");
    res.status(200).json({ allUsernames });
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

//GET only user's name
router.get("/:username", authenticateUser, async (req, res, next) => {
  try {
    const findUser = await User.findOne({ username: req.params.username });
    const hostedEvents = await Event.find({ hostId: findUser._id }).populate({
      path: "hostId",
      select: "username"
    });

    const invitedEvents = await Event.find({
      attendees: { $elemMatch: { userId: findUser._id, status: "pending" } }
    }).populate({
      path: "hostId",
      select: "username"
    });

    const acceptedEvents = await Event.find({
      attendees: { $elemMatch: { userId: findUser._id, status: "accepted" } }
    }).populate({
      path: "hostId",
      select: "username"
    });

    const statuses = [];

    hostedEvents.forEach(event => {
      const status = getEventStatus(event);
      statuses.push(status);
    });

    res.status(200).json({
      username: findUser.username,
      hostedEvents: hostedEvents,
      invitedEvents: invitedEvents,
      acceptedEvents: acceptedEvents,
      statuses: statuses
    });
  } catch (error) {
    res.status(404);
  }
});

module.exports = app => {
  app.use("/users", router);
};
