const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");
const { jwtOptions } = require("../config/passport");

const router = express.Router();

// KIV, can be deleted if not used. Test written. (ZY)
router.get("/", (req, res) => {
  console.log(req.user);
  res.json({ message: "Express is up!" });
});

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
    res.status(201).json({ message: "ok", token: token });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});
module.exports = app => {
  app.use(express.json());
  app.use("/users", router);
};
