var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var board = new Schema({
	region: { type: Schema.Types.ObjectId, ref: 'Region' },
	name: String,
	categories: [String]
});
