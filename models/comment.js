var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comment = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	article: { type: Schema.Types.ObjectId, ref: 'Article'},
	photo_article: { type: Schema.Types.ObjectId, ref: 'PhotoArticle'},
	content: { type: String, required: true },
	star: { type: Number, default: 0 },
	starred_by: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] }
}, {
	minimize: false,
	timestamps: true
});

comment.statics.addStar = function (user, comment_id, callback) {
	var self = this;
	this.update({ _id: comment_id, starred_by: { $ne: user._id }}, { $inc: { star: 10 }, $addToSet: { starred_by: user._id }}, function(err, affected) {
		if (err || affected.nModified === 0) {
			callback(true);
		} else {
			callback(undefined);
		}
	});

};


module.exports = mongoose.model('Comment', comment);

