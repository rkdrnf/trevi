var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');
var Board = require('../models/board.js');
var boardsRouter = require('./boards.js');
var Article = require('../models/article.js');
var RouterHelper = require('../helper/router_helper.js');

router.param('region_name', function(req, res, next, value) {
	Region.findOne({ url: value }).populate('boards places').lean().exec(function(err, region) {
		if (err) {
			next(err);
			return;
		}

		if (region) {
			req.region = region;
			next();
			return;
		}

		next(new Error('failed to load Region'));
	});
});

router.get('/goto_region', function(req, res, next) {
	Region.findOne({ name: new RegExp('.*' + req.query.region + '.*', "i") }).lean().exec(function(err, region) {
		if (err) {
			res.render(500);
			return;
		}

		if (region) {
			res.redirect(region.url);
			return;
		}

		res.render(500);
		return;
	});

});

router.get('/:region_name', RouterHelper.setRecPlaces(), RouterHelper.setRecArticles(), RouterHelper.setRecQuestions(), function(req, res, next) {
	Article.find({ regions: req.region._id }).lean().exec(function(err, recent_articles) {
		res.render('regions/main', { region: req.region, recent_articles: recent_articles, recent_questions: recent_articles, local_data: { location: req.region.location, places: req.region.places } });
	})
});




router.use('/:region_name/boards', boardsRouter);


module.exports = router;

