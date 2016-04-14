var mongoose = require('mongoose');
var Article = require('./article.js');

var travel = new mongoose.Schema({
}, {
	minimize: false,
	timestamps: true,
	discriminatorKey: 'type'
});

module.exports = Article.discriminator("Travel", travel);
