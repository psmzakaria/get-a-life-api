const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message
    }
  });
};

const error400sHandler = (err, req, res, next) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({
      errors: {
        message: err.message
      }
    });
  } else {
    next(err);
  }
};

module.exports = { errorHandler, error400sHandler };
