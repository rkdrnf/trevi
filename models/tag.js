var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tag = new Schema({
	_id: String,
	used_count : Number,
	type: { type: String, enum: ['UserCreated', 'Managed'] }
}, {
	minimize: false
});

tag.virtual('email').get(function() {
	    return this._id;
});

module.exports = mongoose.model('Tag', tag);

