var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 					//저자
	regions: [{ type: Schema.Types.ObjectId, ref: 'Region' }],											//속한 지역
	board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },														//속한 지역에 무슨 게시판인지
	type: { type: String, enum: ['Plain', 'Travel'], default: 'Plain', required: true },
	title: { type: String, minlength: 2, maxlength: 40, required: true },						//제목
	content: { type: String, required: true}, 																			//내용
	photos: { type: [{ type: Schema.Types.ObjectId, ref: 'Photo' }], default: [] },
	comments: { type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], default: [] },
	tags: { type: [{ type: String, ref: 'Tag' }], default: [] },
	star: { type: Number, default: 0},
	starred_by: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] }
}, {
	minimize: false,
	timestamps: true,
	discriminatorKey: 'type'
});

article.statics.addStar = function (user, article_id, callback) {
	this.update({_id: article_id, starred_by: { $ne: user._id }}, { $inc: { star: 10 }, $addToSet: { starred_by: user._id }}, function(err, affected) {
		if (err || affected.nModified === 0) {
			callback(true);
		} else {
			callback(undefined);
		}
	});
};

module.exports = mongoose.model('Article', article);





