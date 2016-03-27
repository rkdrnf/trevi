var express = require('express');
var router = express.Router();
//var Board = require('../models/board.js');
var Article = require('../models/article.js');
var Region = require('../models/region.js');
var Board = require('../models/board.js');
var RouterHelper = require('../helper/router_helper.js');
var Photo = require('../models/photo.js');
var Place = require('../models/place.js');

router.get('/new', RouterHelper.checkUserLoggedIn, function(req, res, next) {
	//	var region_ids = JSON.parse(req.query.regions);
	//	var board_ids = JSON.parse(req.query.boards);
	Region.find().lean().exec(function(err, regions) {
		if (err) res.render(500);
		Board.find().lean().exec(function(err, boards) {
			if (err) res.render(500);

			var renderParams = {
				//				current_region: region_ids,
				//				current_board: board_ids,
				regions: regions, 
				boards: boards, 
				redirect_url: req.query.redirect_url ? encodeURIComponent(req.query.redirect_url) : ""
			};

			res.render('articles/new', renderParams);
		});
	});
});

router.post('/create', RouterHelper.checkUserLoggedIn, function(req, res, next) {
	var photo_ids = req.body.image_ids ? req.body.image_ids.split(';') : [];
	var region_ids = req.body.regions ? req.body.regions.split(';') : [];
	Article.create({ author: req.user._id, regions: region_ids, board: req.body.board, title: req.body.title, content: req.body.article_content, photos: photo_ids}, function(err, article) {
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

router.get('/', RouterHelper.setRecPlaces(), RouterHelper.setRecArticles(), function(req, res, next) {
	var region_ids = req.query.regions ? req.query.regions : [];
	var board_ids = req.query.boards ? req.query.boards : [];

	var query = {};
	if (region_ids.length > 0) {
		query.regions = { $in : region_ids };
	}
	if (board_ids.length > 0) {
		query.board = { $in : board_ids };
	}

	Region.find().lean().exec(function(err, regions) {
		if (err) res.render(500);
		Board.find().lean().exec(function(err, boards) {
			if (err) res.render(500);
			Article.find(query).populate('author comments').lean().exec(function(err, articles) {
				res.render('articles/main', { articles: articles, regions: regions, checked_regions: region_ids, boards: boards, checked_boards: board_ids, recommended_places: req.rec_places, recommended_articles: req.rec_articles, recommended_questions: req.rec_articles });
			});
		}); 
	});
});

router.get('/:article_id', RouterHelper.setRecPlaces({}), RouterHelper.setRecArticles({}), function(req, res, next) {
	Article.findOne({ _id: req.params.article_id }).populate('author regions board photos comments.author').lean().exec(function (err, article) {
		res.render('articles/show', { article: article, recommended_articles: req.rec_articles, recommended_questions: req.rec_articles, recommended_places: req.rec_places});
	});
});


module.exports = router;

