var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
	name: { type: String },
	region: { type: String },
	latitude: { type: Number },
	longitude: { type: Number },
	place_text: { type: String },
	place_image_path: { type: String }
});	

placeSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 0 && !pattern.test(name); 
};

module.exports = mongoose.model('Place', placeSchema);
