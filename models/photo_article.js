var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var photoArticle = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
	description: { type: String },
	photo: { type: Schema.Types.ObjectId, ref: 'Photo', required: true },
	comments: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
	tags: { type: [{ type: String, ref: 'Tag' }], default: [] },
	star: { type: Number, default: 0 },
	starred_by: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] }
}, {
	minimize: false,
	timestamps: true
});

module.exports = mongoose.model('PhotoArticle', photoArticle);


