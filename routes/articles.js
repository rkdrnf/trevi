var express = require('express');
var router = express.Router();
//var Board = require('../models/board.js');
var Article = require('../models/article.js');
var Region = require('../models/region.js');
var Board = require('../models/board.js');
var RouterHelper = require('../helper/router_helper.js');

router.get('/new', RouterHelper.checkUserLoggedIn, function(req, res, next) {
	Region.find().lean().exec(function(err, regions) {
		if (err) res.render(500);
		Board.findOne({ _id: req.query.board }).lean().exec(function(err, board) {
			if (err) res.render(500);

			var renderParams = {
				current_region: req.query.region,
				regions: regions, 
				board: board, 
				redirect_url: req.query.redirect_url ? encodeURIComponent(req.query.redirect_url) : ""
			};

			res.render('articles/new', renderParams);
		});
	});
});

router.post('/create', RouterHelper.checkUserLoggedIn, function(req, res, next) {
	Article.create({ author: req.user._id, region: req.body.region, board: req.body.board, category: req.body.category, title: req.body.title, content: req.body.content}, function(err) {
		if (err) {
			console.log(err);
			res.render(500);
		}
		else {
			res.redirect(RouterHelper.tryUseRedirectUrl(req, '/'));
		}
	});
});


router.get('/:article_id', function(req, res, next) {
	Article.findOne({ _id: req.params.article_id }).populate('author region board photos').lean().exec(function (err, article) {
		res.render('articles/show', { article: article});
	});
});


module.exports = router;

