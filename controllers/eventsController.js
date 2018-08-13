const respondWithCreatedEvent = (req, res, next) => {
  const event = req.event;
  res.status(201).json(event);
};

const respondWithEvent = (req, res, next) => {
  const payload = req.payload;
  res.status(200).json({ payload });
};

const respondWithSuccessfulUpdateMsg = (req, res, next) => {
  res.status(200).json({ message: "updated" });
};

module.exports = {
  respondWithCreatedEvent,
  respondWithEvent,
  respondWithSuccessfulUpdateMsg
};
