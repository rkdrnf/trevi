var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photo = new Schema({ 
	original: {
		path: { type: String, required: true },			// /images/user_images/file_name
		size: {
			x: Number,
			y: Number
		}
	},
	thumbnail: {
		path: String,	// /images/user_images/thumbnail/file_name
		size: {
			x: Number,
			y: Number
		}
	},
	masonry: {
		path: String,
		size: {
			x: Number,
			y: Number
		}
	},
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	references: { 
		article: { type: Schema.Types.ObjectId, ref: 'Article' },
		photo_article: { type: Schema.Types.ObjectId, ref: 'PhotoArticle' },
		place: { type: Schema.Types.ObjectId, ref: 'Place' },
		user: { type: Schema.Types.ObjectId, ref: 'User' }
	}
});


photo.statics.toURL = function(path) {
	return path;
};
photo.statics.toFilePath = function(path) {
	return "/public" + path;
};

photo.statics.getImagePath = function(type) {
	switch(type) {
		case 'Article':
			return '/images/user_images/';

		case 'PhotoArticle':
			return '/images/photo_article_images/';
		
		case 'Place':
			return '/images/place_photos/';

		case 'User':
			return '/images/profile_photos/';
	}

	throw new Error('invalid image path type');
};

photo.statics.getThumbnailPath = function(type) {
	return this.getImagePath(type) + 'thumbnail/';
};

photo.statics.getMasonryPath = function(type) {
	return this.getImagePath(type) + 'masonry/';
};



module.exports = mongoose.model('Photo', photo);
