const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");
const Event = require("./../models/event");
const { passport } = require("../config/passport");
const { jwtOptions } = require("../config/passport");
const { authenticateUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const user = new User({ username });
  user.setPassword(password);
  try {
    await user.save();
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(401).json({ message: "no such user found" });
  }

  if (user.validPassword(password)) {
    const userId = { id: user.id };
    const token = jwt.sign(userId, jwtOptions.secretOrKey);
    res
      .status(201)
      .cookie("jwt", token, {
        httpOnly: true,
        secure: false
      })
      .json({ message: "Signed in successfully!" });
  } else {
    res.status(401).json({ message: "passwords did not match" });
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

    res
      .status(200)
      .json({ username: findUser.username, hostedEvents: hostedEvents });
  } catch (error) {
    res.status(404);
  }
});

module.exports = app => {
  app.use("/users", router);
};
