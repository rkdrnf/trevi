var express = require('express');
var router = express.Router();
//var Board = require('../models/board.js');
var Article = require('../models/article.js');
var Region = require('../models/region.js');
var Board = require('../models/board.js');
var RouterHelper = require('../helper/router_helper.js');
var Photo = require('../models/photo.js');

router.get('/new', RouterHelper.checkUserLoggedIn, function(req, res, next) {
	Region.find().lean().exec(function(err, regions) {
		if (err) res.render(500);
		Board.find({_id: req.query.board}).populate('categories').lean().exec(function(err, boards) {
			if (err) res.render(500);
			
			var renderParams = {
				current_region: req.query.region,
				current_board: req.query.board,
				regions: regions, 
				boards: boards, 
				categories: boards.categories,
				redirect_url: req.query.redirect_url ? encodeURIComponent(req.query.redirect_url) : ""
			};

			res.render('articles/new', renderParams);
		});
	});
});

router.post('/create', RouterHelper.checkUserLoggedIn, function(req, res, next) {
	var photo_ids = req.body.image_ids.split(';');
	Article.create({ author: req.user._id, region: req.body.region, board: req.body.board, category: req.body.category, title: req.body.title, content: req.body.content, photos: photo_ids}, function(err) {
		if (err) {
			console.log(err);
			res.render(500);
		}
		else {
			res.redirect(RouterHelper.tryUseRedirectUrl(req, '/'));

			Photo.update({ _id: { $in: photo_ids }}, { $push: { 'references.articles' : article._id }}, function (err) {
				if (err) return;
			});
		}
	});
});

router.get('/', function(req, res, next) {
	var region_ids = JSON.parse(req.query.regions);
	var board_ids = JSON.parse(req.query.boards);

	Region.find().lean().exec(function(err, regions) {
		if (err) res.render(500);
		Board.find().lean().exec(function(err, boards) {
			if (err) res.render(500);

			Article.find({ board: { $in: board_ids}}).lean().exec(function(err, articles) {
				res.render('articles/main', { articles: articles, regions: regions, checked_regions: region_ids, boards: boards, checked_boards: board_ids });
			});
		}); 
	});
});

router.get('/:article_id', function(req, res, next) {
	Article.findOne({ _id: req.params.article_id }).populate('author region board photos').lean().exec(function (err, article) {
		res.render('articles/show', { article: article});
	});
});


module.exports = router;

