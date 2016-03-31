var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photo = new Schema({ 
	original: {
		path: String,				// /images/user_images/file_name
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
		articles: { type: Schema.Types.ObjectId, ref: 'Article' },
		photo_articles: { type: Schema.Types.ObjectId, ref: 'PhotoArticle' }
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
