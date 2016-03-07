var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');
var Board = require('../models/board.js');
var boardsRouter = require('./boards.js');

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
	Board.find({ region: req.region._id }).lean().exec(function(err, boards) {
		res.render('regions/main', { region: req.region, boards: boards });
	});
});


router.use('/:region_name/boards', boardsRouter);


module.exports = router;

