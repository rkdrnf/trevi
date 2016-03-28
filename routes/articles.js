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

			Photo.update({ _id: { $in: photo_ids }}, { $addToSet: { 'references.articles' : article._id }}, function (err) {
				if (err) return;
			});
		}
	});
});

router.get('/', setRegion, RouterHelper.setRecPlaces(), RouterHelper.setRecArticles(), RouterHelper.setRecQuestions(), RouterHelper.getAllRegions('_id name boards'), RouterHelper.getAllBoards('_id name'), function(req, res, next) {
	var query = findArticlesQuery(req.query.regions, req.query.boards);
	var board_ids = req.query.boards ? req.query.boards : [];
	var region_ids = req.query.regions ? req.query.regions : [];
	Article.find(query).populate('author').lean().exec(function(err, articles) {
		res.render('articles/main', { articles: articles, checked_regions: region_ids, checked_boards: board_ids, region: req.region });
	});
});

router.post('/addStar', RouterHelper.checkUserLoggedInAjax(function(req, res) {
	res.json({ error: "먼저 로그인해주세요" });
}), function(req, res, next) {
	Article.addStar(req.user, req.body.id, function(err) {
		if (err) 
			res.json({ error: "이미 추천한 게시물입니다."});
		else {
			res.json({});
		}
	});
});

router.get('/:article_id', setRegion, RouterHelper.setRecPlaces(), RouterHelper.setRecArticles(), RouterHelper.setRecQuestions(), function(req, res, next) {
	var query = findArticlesQuery(req.query.regions, req.query.boards);
	Article.find(query).populate('author').lean().exec(function(err, other_articles) {
		Article.findOne({ _id: req.params.article_id }).populate('author regions board photos').populate({ path: 'comments', populate: { path: 'author' }}).lean().exec(function (err, article) {
			res.render('articles/show', { article: article, region: req.region, other_articles: other_articles, regions: req.query.regions, boards: req.query.boards });
		});

	});
});


function findArticlesQuery(regions, boards) {
	var query = {};
	if (!_.isEmpty(regions)) {
		query.regions = { $in : regions };
	}
	if (!_.isEmpty(boards)) {
		query.board = { $in : boards };
	}

	return query;
}


function setRegion(req, res, next) {
	Region.findById(req.query.region).populate('boards').lean().exec(function(err, region) {
		if (err) 
			throw err;

		req.region = region;
		next();
	});
}


module.exports = router;

