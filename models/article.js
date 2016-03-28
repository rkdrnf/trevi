var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Comment = require('./comment.js');
var User = require('./user.js');

var article = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 					//저자
	regions: [{ type: Schema.Types.ObjectId, ref: 'Region' }],											//속한 지역
	board: { type: Schema.Types.ObjectId, ref: 'Board' },														//속한 지역에 무슨 게시판인지
	title: { type: String, minlength: 2, maxlength: 40, required: true },						//제목
	content: { type: String, required: true}, 																			//내용
	photos: [{ type: Schema.Types.ObjectId, ref: 'Photo', default: [] }],
	comments: { type: [Comment.schema], default: [] },
	tags: { type: Schema.Types.ObjectId, ref: 'Tag', default: [] },
	star: { type: Number, default: 0}
}, {
	minimize: false,
	timestamps: true
});

article.statics.addStar = function (user, article_id, callback) {
	var self = this;
	User.update({_id: user._id}, { $addToSet: { starred_articles: article_id }}, function(err, affected) {
		if (err || affected === 0) {
			callback(true);
		} else {
			self.update({ _id: article_id}, { $inc: { star: 10 }}, function (err) {});
			callback(undefined);
		}
	});
};


module.exports = mongoose.model('Article', article);





