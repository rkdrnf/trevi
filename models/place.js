var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
	name: { type: String },
	category: [{ type: String }],
	description: String,
	region: { type: Schema.Types.ObjectId, ref: 'Region' },
	latitude: { type: Number },
	longitude: { type: Number },
	photos: [{type: Schema.Types.ObjectId, ref: 'PlacePhoto' }],
	star: {
		average: { type: Number, default: 0 },
		voted: { type: Number, default: 0 },
		starred_by: [{
			voter: { type: Schema.Types.ObjectId, ref: 'User' },
			rate: { type: Number }
		}]
	}
}, {
	minimize: false
});	

placeSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 0 && !pattern.test(name); 
};

module.exports = mongoose.model('Place', placeSchema);
