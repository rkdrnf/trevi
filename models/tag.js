var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tag = new Schema({
	_id: String,
	used_count : { type: Number, default: 0 },
	type: { type: String, enum: ['UserCreated', 'Managed'], default: 'UserCreated' }
}, {
	minimize: false
});

tag.virtual('name').get(function() {
	    return this._id;
});


tag.statics.createOrUpdate = function(tags) {
	var self = this;
	tags.forEach(function(tag) {
		self.findByIdAndUpdate(tag, { $inc: { used_count : 1 }}, { upsert: true, setDefaultsOnInsert: true }, function(err) {
			if (err) console.log(err);
		});
	});

	//return tags.map(function(tag) { return mongoose.Types.ObjectId(tag); });
	return tags;
};

module.exports = mongoose.model('Tag', tag);

