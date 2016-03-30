var express = require('express');
var router = express.Router();
var PhotoArticle = require('../models/photo_article.js');

router.get('/', function(req, res) {
	PhotoArticle.find({ region: req.region._id }, function(err, photoArticles) {
		res.render('photo_articles/index.jade', { photoArticles: photoArticles });
	});
});

router.get('/:id', function(req, res) {
	PhotoArticle.findById(req.params.id, function(err, photoArticle) {
		res.render('photo_articles/show.jade', { photoArticle: photoArticle });
	});
});

module.exports = router;
