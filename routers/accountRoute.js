const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");
const { jwtOptions } = require("../config/passport");

const router = express.Router();
router.use(express.json());

const getJwtCookie = userId => {
  return {
    name: "jwt",
    token: jwt.sign(userId, jwtOptions.secretOrKey),
    configs: {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 60 * 1000
    }
  };
};

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  if (!password) {
    const error = new Error("Password is required");
    error.name = "ValidationError";
    return next(error);
  }

  const user = new User({ username });
  user.setPassword(password);

  try {
    const newUser = await user.save();
    const userId = { id: newUser.id };

    res
      .status(201)
      .cookie({ ...getJwtCookie(userId) })
      .json(user.toDisplay());
  } catch (err) {
    next(err);
  }
});

router.post("/signin", async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(401).json({ message: "no such user found" });
  }

  if (user.validPassword(password)) {
    const userId = { id: user.id };

    res
      .cookie({ ...getJwtCookie(userId) })
      .json({ message: "Signed in successfully!" });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});

module.exports = app => {
  app.use("/account", router, (err, req, res, next) => {
    if (err.name === "ValidationError") {
      return res.status(400).json(err.message);
    }
  });
};
