const app = require("./app");

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`get-a-life-api has started on PORT ${server.address().port}`);
});
