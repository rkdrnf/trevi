var mongoose = require('mongoose');
var Place = require('./place.js');

var restaurant = new mongoose.Schema({
	menus: {
		name: String,
		price: Number
	}
}, {
	minimize: false,
	discriminatorKey: 'type'
});

module.exports = Place.discriminator("Restaurant", restaurant);


