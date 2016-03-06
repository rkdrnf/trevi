var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var article = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	region: [{ type: Schema.Types.ObjectId, ref: 'Region' }],
	board: { type: Schema.Types.ObjectId, ref: 'Board' },
	category: String,
	title: { type: String, minlength: 4, maxlength: 40 },
	content: { type: String } 
});
