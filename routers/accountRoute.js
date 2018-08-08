const express = require("express");
const { asyncErrorHandler } = require("../middlewares/asyncErrorHandler");
const { signUp, signIn } = require("../services/authenticationService");
const { error400sHandler } = require("../middlewares/errorHandler");

const router = express.Router();

router.use(express.json());
router.post("/signup", asyncErrorHandler(signUp));
router.post("/signin", signIn);

module.exports = app => {
  app.use("/account", router, error400sHandler);
};
