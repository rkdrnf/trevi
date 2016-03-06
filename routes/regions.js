var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');

router.param('region_name', function(req, res, next, value) {
	Region.findOne({ url: value }).lean().exec(function(err, region) {
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

router.get('/:region_name', function(req, res, next) {
	res.render('regions/main', { region: req.region });
});


module.exports = router;

