const mongoose = require("mongoose");
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Username cannot be empty"],
    match: [
      /^[a-zA-Z0-9]+$/,
      "is invalid, username contains only alphanumeric characters"
    ],
    index: true
  },
  hash: String,
  salt: String
});

UserSchema.plugin(uniqueValidator, {
  message: "Username already exists"
});

UserSchema.methods.setPassword = function(password) {
  this.salt = generateSalt();
  this.hash = hashPassword(password, this.salt);
};

UserSchema.methods.validPassword = function(password) {
  return this.hash === hashPassword(password, this.salt);
};

UserSchema.methods.toDisplay = function() {
  let smallObject = {
    _id: this._id,
    username: this.username
  };
  return smallObject;
};

const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

const hashPassword = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
