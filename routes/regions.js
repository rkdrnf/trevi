var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');
var Article = require('../models/article.js');
var photosRouter = require('./photo_articles.js');
var Restaurant = require('../models/restaurant.js');
var Travel = require('../models/travel.js');

router.param('region_name', function(req, res, next, value) {
	Region.findOne({ url: value }).populate('boards').populate({ path: 'places', populate: { path: 'photos', model: 'Photo' }}).lean().exec(function(err, region) {
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

router.get('/goto_region', function(req, res) {
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

router.get('/:region_name', function(req, res) {
	Travel.find({ regions: req.region._id }).limit(4).lean().exec(function(err, travels){
		Article.find({ regions: req.region._id }).limit(3).lean().exec(function(err, recent_articles) {
			res.render('regions/main', { region: req.region, recent_articles: recent_articles, recent_questions: recent_articles, travels: travels, local_data: { location: req.region.location, places: req.region.places } });
		});

	});
});

router.get('/:region_name/restaurants', function(req, res) {
	var query = {
		region: req.region._id
	};

	Restaurant.find(query).lean().exec(function(err, restaurants) {
		res.render('regions/restaurants', { restaurants: restaurants, region: req.region, local_data: { region_id: req.region._id }});
	});
});


router.use('/:region_name/photos', photosRouter);


module.exports = router;

