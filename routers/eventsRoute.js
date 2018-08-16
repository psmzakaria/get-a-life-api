const express = require("express");
const Event = require("./../models/event");
const eventService = require("../services/eventService");
const eventsController = require("../controllers/eventsController");
const { authenticateUser } = require("../middlewares/auth");
const { asyncErrorHandler } = require("../middlewares/asyncErrorHandler");
const { error400sHandler } = require("../middlewares/errorHandler");

const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  asyncErrorHandler(eventService.createEvent),
  eventsController.respondWithCreatedEvent
);

router.get(
  "/:id/dates",
  asyncErrorHandler(eventService.getAttendance),
  eventsController.respondWithAttendance
);

router.get(
  "/:id",
  asyncErrorHandler(eventService.getEventByIdWithHostName),
  eventsController.respondWithEvent
);

router.put(
  "/:id/rsvp",
  authenticateUser,
  asyncErrorHandler(eventService.updateAttendeeAvailabilityInEvent),
  eventsController.respondWithSuccessfulUpdateMsg
);

router.put(
  "/:id/update",
  authenticateUser,
  asyncErrorHandler(eventService.updateEvent),
  eventsController.respondWithSuccessfulUpdateMsg
);

module.exports = app => {
  app.use("/events", router, error400sHandler);
};
