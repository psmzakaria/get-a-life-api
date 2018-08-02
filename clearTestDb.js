const mongoose = require('mongoose');

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/jumpstart-test';

mongoose.connect(mongodbUri, async () => {
	await mongoose.connection.db.dropDatabase();
	mongoose.connection.close();
});