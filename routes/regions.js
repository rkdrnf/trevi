var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');
var Board = require('../models/board.js');
var boardsRouter = require('./boards.js');

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

router.get('/goto_recommands', function(req, res, next) {
	
});

router.get('/:region_name', function(req, res, next) {
	res.render('regions/main', { region: req.region, local_data: { location: req.region.location, places: req.region.places } });
});




router.use('/:region_name/boards', boardsRouter);


module.exports = router;

