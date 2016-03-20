var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photo = new Schema({
	path: String,				// /images/user_images/file_name
	thumbnail: String,	// /images/user_images/thumbnail/file_name
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	references: { 
		articles: { type: Schema.Types.ObjectId, ref: 'Article' }
	}
});


photo.statics.toURL = function(path) {
	return path;
};

photo.statics.toFilePath = function(path) {
	return "/public" + path;
};

photo.statics.userImagePath = '/images/profile_photos/';
photo.statics.thumbnailPath = '/images/profile_photos/thumbnail';

module.exports = mongoose.model('Photo', photo);
