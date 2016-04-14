var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var board_types = ["Normal", "Photo", "Journal"];

var boardSchema = new Schema({
	name: String,
	type: { type: String, enum: board_types, default: "Normal", required: true},
	major: { type: Boolean, default: false, required: true }
}, {
	minimize: false
});


boardSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 0 && !pattern.test(name);
};

boardSchema.statics.getTypes = function() {
	return board_types;
};


module.exports = mongoose.model('Board', boardSchema);
