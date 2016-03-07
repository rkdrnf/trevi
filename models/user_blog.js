var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userBlogSchema = new Schema({
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	boards: [{ type: Schema.Types.ObjectId, ref: 'BlogBoard' }],
	url: String
});

module.exports = mongoose.model('UserBlog', userBlogSchema);
