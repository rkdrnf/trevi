var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userBlogSchema = new Schema({
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	boards: [{ type: Schema.Types.ObjectId, ref: 'BlogBoard' }],
	url: String
});


userBlogSchema.statics.createUrl = function(user) {
	return user.getBlogUrlCandidate();
	//this.createUrlRecursive(user, user.getBlogUrlCandidate(), 1);
};

userBlogSchema.statics.createUrlRecursive = function(user, url, index) {
	this.findOne({ url: url }).lean().exec(function(err, blog) {
		if (blog) {
			index++;
			return this.createUrl(user, url + index.toString(), index);
		}

		return url;
	});
};


module.exports = mongoose.model('UserBlog', userBlogSchema);
