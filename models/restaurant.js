var mongoose = require('mongoose');
var Place = require('./place.js');

var price_levels = ['high', 'middle', 'low'];

var restaurant = new mongoose.Schema({
	menus: { type: [{
		name: String,
		price: Number
	}], default: [] },
	price_level: { type: String, enum: price_levels }
}, {
	minimize: false,
	discriminatorKey: 'type'
});

restaurant.statics.getPriceLevels = function() { return price_levels; };

module.exports = Place.discriminator("Restaurant", restaurant);


