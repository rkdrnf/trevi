var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	name: { type: String },
	description: String,
	region: { type: Schema.Types.ObjectId, ref: 'Region' }
//	period: 
}, {
	minimize: false
});

eventSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 0 && !pattern.test(name); 
};

module.exports = mongoose.model('Event', eventSchema);
