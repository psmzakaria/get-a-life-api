const mongoose = require("mongoose");
const User = require("./user");

const EventSchema = new mongoose.Schema({
  title: String,
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator(userId) {
        return User.findById(userId);
      },
      message: "Invalid User ID"
    }
  },
  proposedDates: [
    {
      type: String
    }
  ],
  matchedDates: [
    {
      type: String
    }
  ],
  selectedDate: String,
  attendees: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
          validator(userId) {
            return User.findById(userId);
          },
          message: "Invalid User ID"
        }
      },
      status: String,
      availableDates: [
        {
          type: String
        }
      ]
    }
  ]
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
