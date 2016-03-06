var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photo = new Schema({
	path: String,
	author: { type: Schema.Types.ObjectId, ref: 'User' }
});
