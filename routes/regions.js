var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');
var Board = require('../models/board.js');
var boardsRouter = require('./boards.js');

router.param('region_name', function(req, res, next, value) {
	Region.findOne({ url: value }).populate('boards').lean().exec(function(err, region) {
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

router.get('/ajax_regions_for_search', function(req, res, next) {
	Region.find().lean().exec(function(err, regions) {
		console.log(regions);
		
		res.json(regions.map(function(region) { return { id: region.url, name: region.name }; }));
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

router.get('/:region_name', function(req, res, next) {
	Board.find({ region: req.region._id }).lean().exec(function(err, boards) {
		res.render('regions/main', { region: req.region });
	});
});




router.use('/:region_name/boards', boardsRouter);


module.exports = router;

