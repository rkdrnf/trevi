var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogBoardSchema = new Schema({
	blog: { type: Schema.Types.ObjectId, ref: 'UserBlog' },
	name: String
	type: { type: String }				//must be able to select from enum list
});


module.exports = mongoose.model('BlogBoard', blogBoardSchema);
