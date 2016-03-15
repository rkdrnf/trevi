var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = new Schema({
	name: String
}, {
	minimize: false
});


boardSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 0 && !pattern.test(name);
};


module.exports = mongoose.model('Board', boardSchema);
