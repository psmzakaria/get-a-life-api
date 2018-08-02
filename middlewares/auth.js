const { passport } = require("../config/passport");
const authenticateUser = passport.authenticate("jwt", { session: false });

module.exports = {
  authenticateUser
};
