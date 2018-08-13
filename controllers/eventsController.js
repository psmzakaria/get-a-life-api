const respondWithCreatedEvent = (req, res, next) => {
  const event = req.event;
  res.status(201).json(event);
};

module.exports = {
  respondWithCreatedEvent
};
