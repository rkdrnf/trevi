var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var board_types = ["Normal", "Photo", "Travel"];
var unique_names = ["Freeboard", "Information", "Question", "Travel", "TrainTrip"];

var boardSchema = new Schema({
	name: String,
	type: { type: String, enum: board_types, default: "Normal", required: true},
	unique_name: { type: String, enum: unique_names, unique: true, sparse: true },
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

boardSchema.statics.getUniqueNames = function() {
	return unique_names;
};


module.exports = mongoose.model('Board', boardSchema);
