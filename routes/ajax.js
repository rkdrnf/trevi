var express = require('express');
var router = express.Router();

var Region = require('../models/region.js');
var Board = require('../models/board.js');

router.get('/regions_for_search_dbid', function (req, res, next) {
	Region.find().lean().exec(function(err, regions) {
		res.json(regions.map(function(region) { return { id: region._id, name: region.name }; }));
	});

});

router.get('/regions_for_search', function(req, res, next) {
	Region.find().lean().exec(function(err, regions) {
		res.json(regions.map(function(region) { return { id: region.url, name: region.name }; }));
	});
});


router.get('/boards_for_search', function(req, res, next) {
	Region.find().lean().exec(function(err, regions) {
		Board.find().lean().exec(function(err, boards) {
			res.json({ regions: regions, boards: boards });
		});
	});
});

module.exports = router;
