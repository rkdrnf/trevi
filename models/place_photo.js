var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placePhoto = new Schema({
	path: String,				// /images/place_photos/file_name
	thumbnail: String,	// /images/place_photos/thumbnail/file_name
	owner: { type: Schema.Types.ObjectId, ref: 'User' }
});


placePhoto.statics.toURL = function(path) {
	return path;
};

placePhoto.statics.toFilePath = function(path) {
	return "/public" + path;
};

placePhoto.statics.placeImagePath = '/images/place_photos/';
placePhoto.statics.thumbnailPath = '/images/place_photos/thumbnail';

module.exports = mongoose.model('PlacePhoto', placePhoto);
