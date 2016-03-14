var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photo = new Schema({
	path: String,				// /public/images/user_images/file_name
	thumbnale: String,	// /public/images/user_images/thumbnail/file_name
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

photo.statics.userImagePath = '/public/images/user_images/';
photo.statics.thumbnailPath = '/public/images/user_images/thumbnail';

module.exports = mongoose.model('Photo', photo);
