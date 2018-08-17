const { passport } = require("../config/passport");
const authenticateUser = passport.authenticate("jwt", { session: false });

const authenticateAccount=(req,res,next)=>{
  if(req.params.username === req.user.username) {
      next()
  } else {
    res.status(401).json({message:"Incorrect Authorization"})
  }

}


module.exports = {
  authenticateUser,
  authenticateAccount
};
