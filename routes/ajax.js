var express = require('express');
var router = express.Router(); 
var Region = require('../models/region.js');
var Board = require('../models/board.js');
var Tag = require('../models/tag.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');
var Restaurant = require('../models/restaurant.js');
var Place = require('../models/place.js');

router.get('/regions_for_search_dbid', function (req, res) {
	Region.find().select('_id name').lean().exec(function(err, regions) {
		res.json(regions.map(function(region) { return { id: region._id, name: region.name }; }));
	}); 
});

router.get('/regions_for_search', function(req, res) {
	var query = {};
	if (req.query.region_name) {
		console.log(req.query.region_name);
		query.name = new RegExp(req.query.region_name, "i");
	}
	Region.find(query).select('url name').lean().exec(function(err, regions) {
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
	Comment.find({ place: req.query.place }).populate({ path: 'author', select: '_id local.name google.name facebook.name'}).select('author content createdAt updatedAt').lean().exec(function(err, comments) {
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

router.get('/get_restaurants', function(req, res) {
	var query = {};
	if (req.query.region_id) {
		query.region = req.query.region_id;
	}

	if (req.query.categories && req.query.categories.length > 0) {
		query.categories = { $in: req.query.categories };
	}

	if (req.query.prices && req.query.prices.length > 0) {
		query.price_level = { $in: req.query.prices };
	}


	Restaurant.find(query).populate('comments photos').lean().exec(function(err, rests) {
		if (err) {
			console.log(err);
			res.json({ restaurants: [] });
			return;
		}

		if (!rests) {
			res.json({ restaurants: [] });
		}

		rests.forEach(function(rest) {
			rest.famous_comments = rest.comments.slice(0, 2);
			rest.comments_count = rest.comments.length;
			delete rest.comments;
		});

		rests.forEach(function(rest) {
			rest.main_photo = rest.photos.length > 0 ? rest.photos[0] : null;
			delete rest.photos;
		});
		res.json({ restaurants: rests });
	});
});

router.get('/get_place', function(req, res) {
	Place.findById(req.query.place_id).populate("photos").populate({ path: "comments", populate: { path: "author" }}).lean().exec(function(err, place) {
		place.comments.forEach(function(comment) { 
			if (comment.author) {
				comment.author.name = User.getName(comment.author);
			}
		});

		res.json({ place: place });
	});
});

router.get('/regions_boards_data', function(req, res) {
	Region.find({}).select("_id name boards").lean().exec(function(err, regions) {
		if (err) {
			console.log(err);
			throw err;
		}
		Board.find({}).select("_id name type").lean().exec(function(err, boards) {
			if (err) {
				console.log(err);
				throw err;
			}

			res.json({ regions: regions, boards: boards });
		});
	});
});

module.exports = router;
