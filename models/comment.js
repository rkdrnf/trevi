var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comment = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
	content: { type: String, required: true }
}, {
	minimize: false,
	timestamps: true
});


module.exports = mongoose.model('Comment', comment);

