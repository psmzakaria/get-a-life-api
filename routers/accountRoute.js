const express = require("express");
const { asyncErrorHandler } = require("../middlewares/asyncErrorHandler");
const { signUp, signIn } = require("../services/authenticationService");

const router = express.Router();

router.use(express.json());
router.post("/signup", asyncErrorHandler(signUp));
router.post("/signin", signIn);

module.exports = app => {
  app.use("/account", router, (err, req, res, next) => {
    if (err.name === "ValidationError") {
      return res.status(400).json(err.message);
    }
  });
};
