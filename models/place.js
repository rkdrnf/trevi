var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new Schema({
	name: { type: String },
	region: { type: Schema.Types.ObjectId, ref: 'Region' },
	latitude: { type: Number },
	longitude: { type: Number }
});	

placeSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 0 && !pattern.test(name); 
};

module.exports = mongoose.model('Place', placeSchema);
