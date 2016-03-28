var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comment = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
	content: { type: String, required: true },
	star: { type: Number, default: 0 }
}, {
	minimize: false,
	timestamps: true
});

comment.methods.addStar = function () {
	this.star += 10;
};


module.exports = mongoose.model('Comment', comment);

