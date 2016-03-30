var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regionSchema = new Schema({
	name: { type: String },
	url: { type: String },
	boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
	promotion_text: { type: String },
	background_image_path: { type: String },
	location: {
		latitude: { type: Number, default: 1},
		longitude: { type: Number, default: 1},
		zoomLevel: { type: Number, default: 1}
	},
	places: [{ type: Schema.Types.ObjectId, ref: 'Place' }]
}, {
	minimize: false
});

regionSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 0 && !pattern.test(name);
};



module.exports = mongoose.model('Region', regionSchema);

