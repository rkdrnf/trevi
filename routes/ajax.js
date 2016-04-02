var express = require('express');
var router = express.Router();

var Region = require('../models/region.js');
var Board = require('../models/board.js');
var Tag = require('../models/tag.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');

router.get('/regions_for_search_dbid', function (req, res) {
	Region.find().lean().exec(function(err, regions) {
		res.json(regions.map(function(region) { return { id: region._id, name: region.name }; }));
	});

});

router.get('/regions_for_search', function(req, res) {
	Region.find().lean().exec(function(err, regions) {
		res.json(regions.map(function(region) { return { id: region.url, name: region.name }; }));
	});
});


router.get('/boards_for_search', function(req, res) {
	Region.find().lean().exec(function(err, regions) {
		Board.find().lean().exec(function(err, boards) {
			res.json({ regions: regions, boards: boards });
		});
	});
});

router.get('/tags_autocomplete', function(req, res) {
	Tag.find().lean().exec(function(err, tags) {
		res.json({tags: tags.map(function(tag) { return { name: tag._id }; }) });
	});
});

router.get('/get_place_comments', function(req, res) {
	Comment.find({ place: req.query.place }).populate('author').select('author content createdAt updatedAt').lean().exec(function(err, comments) {
		if (err) {
			res.json({ error: err });
			return;
		}

		comments.forEach(function(comment) { 
			if (comment.author) {
				comment.author.name = User.getName(comment.author);
			}
		});



		res.json({ comments: comments });
	});
});

module.exports = router;
