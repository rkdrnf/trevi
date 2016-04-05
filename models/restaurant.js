var mongoose = require('mongoose');
var Place = require('./place.js');

var restaurant = new mongoose.Schema({
	menus: { type: [{
		name: String,
		price: Number
	}], default: [] }
}, {
	minimize: false,
	discriminatorKey: 'type'
});

module.exports = Place.discriminator("Restaurant", restaurant);


