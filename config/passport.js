const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
require('dotenv').config();

const User = require('./../models/user');

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_Secret
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
	console.log('payload received', jwt_payload);

	const user = await User.findOne({ _id: jwt_payload.id });
	if (user) {
		done(null, user);
	} else {
		done(null, false);
	}
});

passport.use(jwtStrategy);

module.exports = {
	passport,
	jwtOptions
};
