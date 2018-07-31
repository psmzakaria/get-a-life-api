const express = require('express');
const cors = require('cors');
const app = express();

const indexRouter = require('./routers/index');
const usersRouter = require('./routers/usersRoute');
const eventsRouter = require('./routers/eventsRoute')

if (process.env.NODE_ENV === 'production') {
	app.use(cors({ origin: process.env.GAL_UI_URL }));
} else {
	app.use(cors());
}

app.use(express.json());

indexRouter(app);
usersRouter(app);
eventsRouter(app)

module.exports = app;
