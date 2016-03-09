var router = require('express').Router();
var Board = require('../../models/board.js');
var Region = require('../../models/region.js');
var Article = require('../../models/article.js');
var Author = require('../../models/user.js');
var Photo = require('../../models/photo.js');

router.get('/', function(req, res, next) {
	var query_condition = {};
	if (req.query.board_id) {
		query_condition.board = req.query.board_id;
	}

	Article.find(query_condition).populate('author region board photos').lean().exec(function (err, articles) {
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
	Article.findOne({ _id: req.params.id}).populate('author region board photos').lean().exec(function(err, article) {
			if (err) {
				console.log(err);
				return handleError(err);
			}

	Region.find().lean().exec(function(err, regions){
			if (err) {
				console.log(err);
				return handleError(err);
			}

			res.render('admin/articles/edit', { article: article, regions: regions, redirect_url: req.query.redirect_url });
		});
	});
});

router.post('/update/:id', function(req, res, next) {
//	var categories = req.body.categories.split(';').map(function(cat) { return cat.trim(); }).filter(function(cat) { return cat.length > 0 });
	var photos = req.body.photos ? req.body.photos.split(';').map(function(photo) { return photo.trim(); }).filter(function(photo) { return photo.length > 0 }) : [];

	Article.update({ _id: req.params.id }, { category: req.body.category, title: req.body.title, content: req.body.content, photos: photos }, function(err) { 
		if (err) { 
			console.log(err);
			return handleError(err);
		}

		if (req.query.redirect_url)
			res.redirect(decodeURIComponent(res.query.redirect_url));
		else 
			res.redirect('../');
	});
});

router.get('/delete/:id', function(req, res, next) {
	Article.remove({ _id: req.params.id }, function(err) {
		res.redirect('../');
	});
});


module.exports = router;
