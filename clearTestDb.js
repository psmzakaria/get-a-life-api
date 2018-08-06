const mongoose = require('mongoose');

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/jumpstart-test';

mongoose.connect(mongodbUri, { useNewUrlParser: true }, async () => {
	await mongoose.connection.db.dropDatabase();
	mongoose.connection.close();
});