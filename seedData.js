const mongoose = require("mongoose");
const User = require("./models/user");
const Event = require("./models/event");
const mongodbUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/jumpstart";

mongoose.connect(
  mongodbUri,
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.on("error", error => {
  console.error("An error occured!", error);
});

db.dropDatabase();

const init = async () => {
  const host = new User({
    username: "host"
  });
  host.setPassword("password");
  const newHost = await host.save();

  const guest = new User({
    username: "guest"
  });
  guest.setPassword("password");
  const newGuest = await guest.save();

  const event = new Event({
    title: "Test Event",
    hostId: newHost._id,
    proposedDates: ["13082018", "14082018", "15082018"],
    attendees: [
      {
        userId: newGuest._id,
        status: "pending"
      }
    ]
  });

  const newEvent = await event.save();

  console.log("DONE INIT");
};

// const host = new User({
//   username: "host"
// });
// host.setPassword("password");
// const newHost = host.save();

// const guest = new User({
//   username: "guest"
// });
// guest.setPassword("password");
// const newGuest = guest.save();

// const event = new Event({
//   title: "Test Event",
//   hostId: newHost._id,
//   proposedDates: ["13082018", "14082018", "15082018"],
//   attendees: [
//     {
//       userId: newGuest._id,
//       status: "pending"
//     }
//   ]
// });

// const newEvent = event.save();

init();
