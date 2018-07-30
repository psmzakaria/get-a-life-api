const app = require("./app");
const mongoose = require("mongoose");

const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost/jumpstart";

mongoose.connect(mongodbUri);
const db = mongoose.connection;
db.on("error", error => {
  console.error("An error occured!", error);
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`get-a-life-api has started on PORT ${server.address().port}`);
});
