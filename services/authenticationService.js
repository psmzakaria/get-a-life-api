const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");
const { COOKIE_CONFIGURATION } = require("../config/cookies");

const signUp = async (req, res, next) => {
  const { username, password } = req.body;
  if (!password) {
    const error = new Error("Password is required");
    error.name = "ValidationError";
    return next(error);
  }

  const user = new User({ username });
  user.setPassword(password);

  const newUser = await user.save();
  const userId = { id: newUser.id };
  const token = jwt.sign(userId, jwtOptions.secretOrKey);

  res
    .status(201)
    .cookie("jwt", token, COOKIE_CONFIGURATION)
    .json(user.toDisplay());
};

const signIn = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(401).json({ message: "no such user found" });
  }

  if (user.validPassword(password)) {
    const userId = { id: user.id };
    const token = jwt.sign(userId, jwtOptions.secretOrKey);

    res
      .cookie("jwt", token, COOKIE_CONFIGURATION)
      .json({ message: "Signed in successfully!" });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
};

module.exports = { signUp, signIn };
