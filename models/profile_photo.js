var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profilePhoto = new Schema({
	path: String,				// /images/profile_photos/file_name
	thumbnail: String,	// /images/profile_photos/thumbnail/file_name
	owner: { type: Schema.Types.ObjectId, ref: 'User' }
});


profilePhoto.statics.toURL = function(path) {
	return path;
};

profilePhoto.statics.toFilePath = function(path) {
	return "/public" + path;
};

profilePhoto.statics.userImagePath = '/images/profile_photos/';
profilePhoto.statics.thumbnailPath = '/images/profile_photos/thumbnail';

module.exports = mongoose.model('ProfilePhoto', profilePhoto);
