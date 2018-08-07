const express = require('express');
const { passport } = require('../config/passport');
const eachDay = require('date-fns/each_day');
const format = require('date-fns/format');
const Event = require('./../models/event');
const User = require('../models/user');
const getDate = require('../helpers/getDate');

const router = express.Router();

router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
	try {
		const startDate = getDate(req.body.startDate);
		const endDate = getDate(req.body.endDate);

		const result = eachDay(startDate, endDate);

		// const attendees = req.body.attendees.map(async (attendee) => {
		// 	const attendeeData = await User.findOne({ username: attendee });

		// 	return attendeeData;
		// });

		// console.log(await Promise.all(attendees));

		const newEvent = new Event({
			title: req.body.title,
			proposedDates: result.map((date) => {
				return format(date, 'YYYYMMDD');
			}),
			hostId: req.user._id
			// attendees: attendees
		});
		const event = await newEvent.save();

		res.status(201).json(event);
	} catch (error) {
		next(error);
	}
});

router.get('/:id', async (req, res, next) => {
	const eventId = req.params.id;
	try {
		const event = await Event.findById(eventId).populate('hostId');
		if (event === null) {
			payload = null;
		} else {
			payload = {
				...event._doc,
				hostName: event.hostId.username,
				hostId: event.hostId._id
			};
		}

		res.json({ payload });
	} catch (error) {
		if (error.name === 'CastError') {
			error.status = 400;
		}
		next(error);
	}
});
module.exports = (app) => {
	app.use('/events', router);
};
