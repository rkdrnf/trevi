var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regionSchema = new Schema({
	name: { type: String },
	url: { type: String },
	promotion_text: { type: String },
	background_image_path: { type: String }
});

regionSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 0 && !pattern.test(name);
};

module.exports = mongoose.model('Region', regionSchema);

