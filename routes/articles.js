var express = require('express');
var router = express.Router();
var Article = require('../models/article.js');
var RouterHelper = require('../helper/router_helper.js');
var Photo = require('../models/photo.js');
var ObjectId = require('mongoose').Types.ObjectId;

var qc = require('../helper/query_checker.js');
var QueryChecker = new qc();


QueryChecker.add("/new", [
	{
		name: "regions",
		required: false, type: Array
	}, {
		name: "boards",
		required: false,
		type: Array,
		handler: function (query, boards) {
			if (!query.board && boards.length === 1) {
				query.board = boards[0];
			}
		}
	}, {
		name: "board",
		required: false,
		type: ObjectId
	}, {
		name: "redirect_url",
		required: false,
		type: String
	}
]);
router.get('/new', QueryChecker.check("/new"), RouterHelper.checkUserLoggedIn, function(req, res) {
	var renderParams = {
		redirect_url: req.query.redirect_url ? encodeURIComponent(req.query.redirect_url) : "",
		local_data: {
			regions: req.query.regions,
			board: req.query.board
		}
	};

	res.render('articles/new', renderParams);
});

router.post('/create', RouterHelper.checkUserLoggedIn, RouterHelper.processTags(function(req) {
	return req.body.tags.split(';');
}), function(req, res) {
	var photo_ids = req.body.image_ids ? req.body.image_ids.split(';') : [];
	var region_ids = req.body.regions ? req.body.regions.split(';') : [];
	Article.create({ author: req.user._id, regions: region_ids, board: req.body.board, title: req.body.title, content: req.body.article_content, photos: photo_ids, tags: req.tags}, function(err, article) {
		if (err) {
			console.log(err);
			res.render(500);
		}
		else {
			res.redirect(RouterHelper.tryUseRedirectUrl(req.query.redirect_url, '/'));

			Photo.update({ _id: { $in: photo_ids }}, { $addToSet: { 'references.articles' : article._id }}, function (err) {
				if (err) return;
			});
		}
	});
});


QueryChecker.add("/", [
	{
		name: "region",
		required: false,
		type: ObjectId,
		handler: function(query, region) {
			if (!query.regions) {
				query.regions = [region];
			}
		}
	},
	{
		name: "regions",
		required: false,
		type: Array, handler: function (query, regions) {
			if (!query.region && regions.length === 1) {
				query.region = regions[0];
			}
		}
	},
	{
		name: "boards",
		required: false,
		type: Array
	}
]);

router.get('/', QueryChecker.check("/"), RouterHelper.setRegion("region"), RouterHelper.setRecPlaces(), RouterHelper.setRecArticles(), RouterHelper.setRecQuestions(), RouterHelper.getAllRegions('_id name boards'), RouterHelper.getAllBoards('_id name'), function(req, res) {
	var board_ids = req.query.boards ? req.query.boards : [];
	var region_ids = req.query.regions ? req.query.regions : [];

	var query = findArticlesQuery(region_ids, board_ids);

	Article.find(query).populate('author board regions').lean().exec(function(err, articles) {
		res.render('articles/main', { articles: articles, checked_regions: region_ids, checked_boards: board_ids, region: req.region });
	});
});

router.post('/addStar', RouterHelper.checkUserLoggedInAjax(function(req, res) {
	res.json({ error: "먼저 로그인해주세요" });
}), function(req, res) {
	Article.addStar(req.user, req.body.id, function(err) {
		if (err) 
			res.json({ error: "이미 추천한 게시물입니다."});
		else {
			res.json({});
		}
	});
});



QueryChecker.add("/article_id", [
	{
		name: "region",
		type: ObjectId,
		required: false,
		handler: function(query, region) {
			if (!query.regions) {
				query.regions = [region];
			}
		}
	}
]);
router.get('/:article_id', QueryChecker.check("/article_id"), RouterHelper.setRegion("region"), RouterHelper.setRecPlaces(), RouterHelper.setRecArticles(), RouterHelper.setRecQuestions(), function(req, res) {
	Article.findOne({ _id: req.params.article_id }).populate('author regions board photos').populate({ path: 'comments', populate: { path: 'author' }}).lean().exec(function (err, article) {

		var query = findArticlesQuery(req.query.regions, [article.board] );
		Article.find(query, 'title star author createdAt', { sort: "-_id"}).populate('author').lean().exec(function(err, other_articles) {

			var nextQuery = {
				board: article.board,
			  _id: { $gt: article._id }
			};

			var prevQuery = {
				board: article.board,
				_id: { $lt: article._id }
			};

			if (req.query.region) {
				nextQuery.regions = req.query.region;
				prevQuery.regions = req.query.region;
			}

			Article.findOne(nextQuery, "title star author createdAt", { sort: "_id" }).populate('author').limit(1).lean().exec(function(err, nextArticle) {
				if (err) throw err;
				Article.findOne(prevQuery, "title star author createdAt", { sort: "-_id" }).populate('author').limit(1).lean().exec(function(err, prevArticle) {
					if (err) throw err;
					res.render('articles/show', { article: article, region: req.region, other_articles: other_articles, regions: req.query.regions, boards: req.query.boards, next_article: nextArticle, prev_article: prevArticle });
				});
			});
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


module.exports = router;

