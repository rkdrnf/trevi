var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
	name: { type: String },
	categories: { type: [{ type: String }], default: [] },
	description: { type: String, default: "" },
	region: { type: Schema.Types.ObjectId, ref: 'Region' },
	latitude: { type: Number },
	longitude: { type: Number },
	photos: { type: [{type: Schema.Types.ObjectId, ref: 'Photo' }], default: [] },
	comments: { type: [{type: Schema.Types.ObjectId, ref: 'Comment' }], default: [] },
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
