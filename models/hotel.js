var mongoose = require('mongoose');
var Place = require('./place.js');

var hotel = new mongoose.Schema({
	rooms: {
		name: String,
		price: Number,
		occupancy: Number
	}
});

module.exports = Place.discriminator("Hotel", hotel);


