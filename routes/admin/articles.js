var router = require('express').Router();
var Board = require('../../models/board.js');
var Region = require('../../models/region.js');
var Article = require('../../models/article.js');
var Author = require('../../models/user.js');
var Photo = require('../../models/photo.js');

router.get('/', function(req, res, next) {
	Article.find().populate('author region board photos').lean().exec(function (err, articles) {
		res.render('admin/articles/index', { articles: articles });
	});
});

router.post('/create', function(req, res, next) {
//	var categories = req.body.categories.split(";").map(function(category) { return category.trim(); }).filter(function(category) { return category.length > 0 });
	var photos = req.body.photos.split(";").map(function(photo) { return photo.trim(); }).filter(function(photo) { return photo.length > 0 });

	Article.create({ author: req.body.author, region: req.body.region, board: req.body.board, category: req.body.category, title: req.body.title, content: req.body.content, photos: photos }, function(err) { 
		if (err) {
			console.log(err);
			return handleError(err);
		}

		res.redirect('./');
	});
});


router.get('/edit/:id', function(req, res, next) {
	Article.find().populate('author region board photos').lean().exec(function(err, articles) {
			if (err) {
				console.log(err);
				return handleError(err);
			}

			res.render('admin/articles/edit', { articles: articles });

	});
});

router.post('/update/:id', function(req, res, next) {
//	var categories = req.body.categories.split(';').map(function(cat) { return cat.trim(); }).filter(function(cat) { return cat.length > 0 });
	var photos = req.body.photos.split(";").map(function(photo) { return photo.trim(); }).filter(function(photo) { return photo.length > 0 });

	Article.update({ _id: req.params.id }, { author: req.body.author, region: req.body.region, board: req.body.board, category: req.body.category, title: req.body.title, content: req.body.content, photos: photos }, function(err) { 
		if (err) { 
			console.log(err);
			return handleError(err);
		}
		res.redirect('../');
	});
});

router.get('/delete/:id', function(req, res, next) {
	Article.remove({ _id: req.params.id }, function(err) {
		res.redirect('../');
	});
});


module.exports = router;
