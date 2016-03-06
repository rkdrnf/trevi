var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = new Schema({
	region: { type: Schema.Types.ObjectId, ref: 'Region' },
	name: String,
	categories: [String]
});


boardSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 0 && !pattern.test(name);
};


module.exports = mongoose.model('Board', boardSchema);
