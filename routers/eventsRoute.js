const express = require("express");
const Event = require("./../models/event");
const eventService = require("../services/eventService");
const eventsController = require("../controllers/eventsController");
const { authenticateUser } = require("../middlewares/auth");
const { asyncErrorHandler } = require("../middlewares/asyncErrorHandler");

const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  asyncErrorHandler(eventService.createEvent),
  eventsController.respondWithCreatedEvent
);

router.get("/:id", async (req, res, next) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId).populate("hostId");
    if (event === null) {
      payload = null;
    } else {
      payload = {
        ...event._doc,
        hostName: event.hostId.username,
        hostId: event.hostId._id
      };
    }

    res.json({ payload });
  } catch (error) {
    if (error.name === "CastError") {
      error.status = 400;
    }
    next(error);
  }
});

router.put("/:id/rsvp", async (req, res, next) => {
  const eventId = req.params.id;
  const { status, availableDates } = req.body;
  const username = req.cookies["username"];
  const userId = req.cookies["userId"];

  try {
    const event = await Event.findById(eventId);

    event.attendees.forEach(async attendee => {
      if (attendee.userId.toString() === userId) {
        attendee.availableDates = availableDates;
        attendee.status = status;
        await event.save();
      }
    });
    res.json({ message: "updated" });
  } catch (error) {
    error.status = 400;
    console.log(error);
    next(error);
  }
});

module.exports = app => {
  app.use("/events", router);
};
